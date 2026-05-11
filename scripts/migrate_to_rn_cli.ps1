# PowerShell script to scaffold a React Native CLI app and copy current src
# Review the commands before running. Run from a folder that contains this repo.

param(
  [string]$newName = "reFindNative",
  [string]$sourceRepo = "$(Get-Location)\" # assumes current folder contains this repo
)

Write-Host "This script will create a new RN-CLI TypeScript app named $newName and copy ./src and ./assets into it." -ForegroundColor Cyan

# 1. Create new RN app
Write-Host "Running: npx react-native init $newName --template react-native-template-typescript"
npx react-native init $newName --template react-native-template-typescript

if ($LASTEXITCODE -ne 0) { Write-Error "react-native init failed. Aborting."; exit 1 }

# 2. Copy src and assets
$fromSrc = Join-Path -Path $PWD -ChildPath "src"
$toSrc = Join-Path -Path (Join-Path $PWD $newName) -ChildPath "src"
if (Test-Path $fromSrc) {
  Write-Host "Copying src -> $toSrc"
  robocopy $fromSrc $toSrc /E | Out-Null
} else { Write-Warning "No src folder found in current directory." }

$fromAssets = Join-Path -Path $PWD -ChildPath "assets"
$toAssets = Join-Path -Path (Join-Path $PWD $newName) -ChildPath "assets"
if (Test-Path $fromAssets) {
  Write-Host "Copying assets -> $toAssets"
  robocopy $fromAssets $toAssets /E | Out-Null
} else { Write-Host "No assets folder found; skipping." }

Write-Host "Done. Next steps: cd $newName, install native deps, run Metro with npx react-native run-android (or run-ios on macOS)." -ForegroundColor Green
