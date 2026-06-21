# Start Expo mobile dev server on LAN with API URLs pointing at your machine.
$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot '..\..\..')
Set-Location $Root

$lanIp = (
  Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -like '192.168.*' -or
    $_.IPAddress -like '10.*'
  } |
  Select-Object -First 1 -ExpandProperty IPAddress
)

if (-not $lanIp) {
  Write-Error "Could not detect a LAN IPv4 address. Connect to Wi-Fi/Ethernet and retry."
}

$base = "http://$lanIp"
Write-Host ""
Write-Host "EduAI Mobile LAN - IP: $lanIp" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Expo (scan QR):  exp://${lanIp}:8081" -ForegroundColor White
Write-Host "  Identity API:    ${base}:3001" -ForegroundColor White
Write-Host "  Learning API:    ${base}:3003" -ForegroundColor White
Write-Host "  Demo login:      student@demo.eduai.in / Demo1234!" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Ensure backend is running (pnpm dev:lan or pnpm mvp:dev)." -ForegroundColor Yellow
Write-Host ""

$env:DEV_LAN_HOST = $lanIp
pnpm --filter @eduai/mobile dev -- --lan
