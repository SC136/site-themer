# Builds docs/downloads/site-themer.zip from the site-themer folder.
# Run from this directory:  powershell -File package-extension.ps1
$ErrorActionPreference = "Stop"
$zip = Join-Path $PSScriptRoot "docs\downloads\site-themer.zip"
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $PSScriptRoot "site-themer") -DestinationPath $zip
Write-Host "Created $zip"
