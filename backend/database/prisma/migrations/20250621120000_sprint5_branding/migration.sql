-- Sprint 5: Extended white-label branding fields
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "font_family" VARCHAR(100) DEFAULT 'Inter';
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "accent_color" VARCHAR(7) DEFAULT '#f59e0b';
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "custom_domain_verified" BOOLEAN DEFAULT false;
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "email_header_html" TEXT;
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "email_footer_html" TEXT;
ALTER TABLE "tenant_branding" ADD COLUMN IF NOT EXISTS "mobile_app_name" VARCHAR(100);
