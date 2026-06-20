-- Sprint 4: Row Level Security policies for tenant isolation

CREATE OR REPLACE FUNCTION app_current_tenant_id() RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.tenant_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable RLS on tenant-scoped ERP tables
ALTER TABLE academic_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies (bypass when app.tenant_id not set — Prisma direct access)
CREATE POLICY tenant_isolation_academic_classes ON academic_classes
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_class_enrollments ON class_enrollments
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_attendance ON attendance_records
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_leave ON leave_requests
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_fee_invoices ON fee_invoices
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_fee_payments ON fee_payments
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_exams ON exams
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_exam_results ON exam_results
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_assignments ON assignments
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_notifications ON notifications
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_activity_logs ON activity_logs
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_subscriptions ON tenant_subscriptions
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_billing_invoices ON billing_invoices
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);

CREATE POLICY tenant_isolation_support_tickets ON support_tickets
  USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL);
