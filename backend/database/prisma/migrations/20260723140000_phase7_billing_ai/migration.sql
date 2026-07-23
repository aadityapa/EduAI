-- Phase 7: Billing productionization (additive only)
ALTER TABLE "tenant_subscriptions" ADD COLUMN IF NOT EXISTS "dunning_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tenant_subscriptions" ADD COLUMN IF NOT EXISTS "last_dunning_at" TIMESTAMPTZ;
ALTER TABLE "tenant_subscriptions" ADD COLUMN IF NOT EXISTS "coupon_code" VARCHAR(50);

CREATE INDEX IF NOT EXISTS "idx_tenant_subscriptions_status" ON "tenant_subscriptions" ("status");

ALTER TABLE "billing_invoices" ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE "billing_invoices" ADD COLUMN IF NOT EXISTS "coupon_code" VARCHAR(50);
ALTER TABLE "billing_invoices" ADD COLUMN IF NOT EXISTS "metadata" JSONB NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS "idx_billing_invoices_external" ON "billing_invoices" ("external_id");
CREATE INDEX IF NOT EXISTS "idx_billing_invoices_status" ON "billing_invoices" ("status");

CREATE TABLE IF NOT EXISTS "billing_webhook_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID,
  "provider" "BillingProvider" NOT NULL,
  "event_id" VARCHAR(255) NOT NULL,
  "event_type" VARCHAR(100) NOT NULL,
  "payload_hash" VARCHAR(64),
  "status" VARCHAR(20) NOT NULL DEFAULT 'processed',
  "processed_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "billing_webhook_events_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_billing_webhook_event"
  ON "billing_webhook_events" ("provider", "event_id");
CREATE INDEX IF NOT EXISTS "idx_billing_webhook_processed"
  ON "billing_webhook_events" ("processed_at");
