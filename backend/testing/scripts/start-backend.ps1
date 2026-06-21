# EduAI — start backend APIs only (ports 3001, 3003–3006)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot/..

Write-Host "Starting EduAI backend services..." -ForegroundColor Cyan
Write-Host "  Identity :3001 | Learning :3003 | AI :3004 | ERP :3005 | Billing :3006" -ForegroundColor Gray

pnpm turbo run dev --parallel `
  --filter=@eduai/identity-service `
  --filter=@eduai/learning-service `
  --filter=@eduai/ai-service `
  --filter=@eduai/erp-service `
  --filter=@eduai/billing-service
