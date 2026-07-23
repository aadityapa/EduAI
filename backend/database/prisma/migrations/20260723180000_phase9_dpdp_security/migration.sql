-- Phase 9: DPDP Consent / DSR models, immutable audit, RLS defense-in-depth

-- Enums
CREATE TYPE "ConsentPurpose" AS ENUM (
  'account_core',
  'learning_analytics',
  'ai_tutor',
  'marketing',
  'third_party_sharing',
  'parental_oversight'
);

CREATE TYPE "ConsentStatus" AS ENUM (
  'granted',
  'withdrawn',
  'pending_parental',
  'expired'
);

CREATE TYPE "ParentalVerifyMethod" AS ENUM (
  'email_otp',
  'in_person',
  'school_attestation',
  'digital_signature'
);

CREATE TYPE "DsrRequestType" AS ENUM (
  'access_export',
  'erasure',
  'correction',
  'restrict_processing'
);

CREATE TYPE "DsrRequestStatus" AS ENUM (
  'submitted',
  'in_progress',
  'awaiting_verification',
  'completed',
  'rejected',
  'cancelled'
);

-- Consent records
CREATE TABLE "consent_records" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "subject_user_id" UUID NOT NULL,
  "granted_by_user_id" UUID NOT NULL,
  "purpose" "ConsentPurpose" NOT NULL,
  "status" "ConsentStatus" NOT NULL DEFAULT 'granted',
  "policy_version" VARCHAR(20) NOT NULL DEFAULT '2026.07',
  "evidence" JSONB NOT NULL DEFAULT '{}',
  "parental_method" "ParentalVerifyMethod",
  "parental_verified_at" TIMESTAMPTZ,
  "expires_at" TIMESTAMPTZ,
  "withdrawn_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "consent_records"
  ADD CONSTRAINT "consent_records_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "consent_records"
  ADD CONSTRAINT "consent_records_subject_user_id_fkey"
  FOREIGN KEY ("subject_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "consent_records"
  ADD CONSTRAINT "consent_records_granted_by_user_id_fkey"
  FOREIGN KEY ("granted_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "idx_consent_subject_purpose"
  ON "consent_records"("tenant_id", "subject_user_id", "purpose");

CREATE INDEX "idx_consent_tenant_status"
  ON "consent_records"("tenant_id", "status", "created_at" DESC);

-- Data subject requests
CREATE TABLE "data_subject_requests" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "subject_user_id" UUID NOT NULL,
  "requested_by_user_id" UUID NOT NULL,
  "type" "DsrRequestType" NOT NULL,
  "status" "DsrRequestStatus" NOT NULL DEFAULT 'submitted',
  "purpose_note" TEXT,
  "export_artifact_ref" VARCHAR(500),
  "resolution_note" TEXT,
  "due_at" TIMESTAMPTZ NOT NULL,
  "completed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "data_subject_requests_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "data_subject_requests"
  ADD CONSTRAINT "data_subject_requests_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "data_subject_requests"
  ADD CONSTRAINT "data_subject_requests_subject_user_id_fkey"
  FOREIGN KEY ("subject_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "data_subject_requests"
  ADD CONSTRAINT "data_subject_requests_requested_by_user_id_fkey"
  FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "idx_dsr_tenant_status"
  ON "data_subject_requests"("tenant_id", "status", "created_at" DESC);

CREATE INDEX "idx_dsr_subject"
  ON "data_subject_requests"("tenant_id", "subject_user_id");

-- Immutable audit: block UPDATE/DELETE (append-only)
CREATE OR REPLACE FUNCTION prevent_audit_log_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs are immutable (Phase 9)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_logs_immutable_update ON audit_logs;
CREATE TRIGGER audit_logs_immutable_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW EXECUTE PROCEDURE prevent_audit_log_mutation();

DROP TRIGGER IF EXISTS audit_logs_immutable_delete ON audit_logs;
CREATE TRIGGER audit_logs_immutable_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW EXECUTE PROCEDURE prevent_audit_log_mutation();

-- RLS defense-in-depth (bypass when app.tenant_id unset — Prisma service role)
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_consent_records ON consent_records
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_data_subject_requests ON data_subject_requests
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);
