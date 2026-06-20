# EduAI — start frontend apps only (ports 3000, 3002)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot/..

Write-Host "Starting EduAI frontend..." -ForegroundColor Cyan
Write-Host "  Web (Student/Teacher/Parent) :3000 | Admin CRM :3002" -ForegroundColor Gray

pnpm turbo run dev --parallel --filter=@eduai/web --filter=@eduai/admin
