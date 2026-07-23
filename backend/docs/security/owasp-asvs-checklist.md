# OWASP ASVS mindset checklist (Phase 9)

Engineering self-assessment against ASVS L1/L2 themes relevant to EduAI.  
**Not a formal certification.** Pen-test / ASVS L2 evidence is Phase 12.

| Area | Control | Status | Evidence |
|------|---------|--------|----------|
| V1 Architecture | Threat model documented | Done | `threat-model.md` |
| V2 Auth | Secrets fail-closed in prod | Done | `resolveJwtSecret`, `resolveAuthSecret` |
| V2 Auth | Password hashing | Done | bcrypt cost 12 |
| V2 Auth | Session / token revocation | Done | Redis revocation (Phase 6) |
| V3 Session | Short-lived access + refresh | Done | JWT 15m / 7d |
| V4 Access control | RBAC on mutating APIs | Done | `@RequirePermission` |
| V4 Access control | Tenant + owner IDOR tests | Done | Consent/DSR specs + Phase 6 tenant suite |
| V5 Validation | DTO validation | Done | class-validator (Phase 6) |
| V5 Injection | Parameterized ORM | Done | Prisma |
| V9 Communications | TLS docs | Done | `security-architecture.md` + residency |
| V10 Malicious | Upload MIME/size + scan hook | Done | `validateUploadFile`, FileUploader, `scanUpload` |
| V10 SSRF | URL allowlist | Done | `assertSafeExternalUrl` on homework media |
| V12 Files | Path-safe names | Done | Upload validators |
| V13 API | Standard error envelope | Done | Phase 6 |
| V14 Config | No secrets in repo | Done | CI gitleaks + `ci-security-scan.mjs` |
| V7 Error/logging | Immutable audit + anomalies | Done | Triggers + `recordFailedLogin` |
| V6 Crypto | Field-level AES-GCM helper | Done | `encryptField` (opt-in key) |
| V8 Data protection | Consent + DSR | Done | identity `/consent`, `/privacy` |
| V4 RLS | Defense-in-depth evaluation | Done | `postgres-rls-evaluation.md` |

## Open / deferred

| Item | Follow-up |
|------|-----------|
| Full ASVS L2 evidence pack | Phase 12 |
| Live antivirus sidecar | Ops enable `SCAN_WEBHOOK_URL` / ClamAV |
| MFA | Post–Phase 9 roadmap |
| Systematic field encryption migration for legacy `users.phone` | Opt-in; avoid breaking demo seeds |
