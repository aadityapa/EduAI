param(
  [string]$Source = "g:\stitch_eduai_platform",
  [string]$Dest = "$PSScriptRoot"
)

if (-not (Test-Path $Source)) {
  Write-Error "Stitch source not found: $Source"
  exit 1
}

Write-Host "Importing Stitch files from $Source -> $Dest"
robocopy $Source $Dest /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { exit $LASTEXITCODE }

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
Push-Location $repoRoot
node "frontend/design/stitch/generate-mobile-screens.mjs"
Pop-Location

Write-Host "Stitch import complete. See frontend/design/stitch/manifest.json"
