# PowerShell script to update Tailwind CDN URL to use Backblaze B2
# Usage: .\update-tailwind-cdn.ps1 "https://f002.backblazeb2.com/file/your-bucket-name/tailwind-cdn.js"

param(
    [Parameter(Mandatory = $true)]
    [string]$BackblazeUrl
)

$CurrentCDN = "https://cdn.tailwindcss.com"
$LocalCDN = "/assets/tailwind-cdn.js"

Write-Host "Updating Tailwind CDN URL..." -ForegroundColor Yellow
Write-Host "From: $CurrentCDN or $LocalCDN" -ForegroundColor Red
Write-Host "To: $BackblazeUrl" -ForegroundColor Green
Write-Host ""

# Update frontend/public/index.html
$frontendHtml = "frontend/public/index.html"
if (Test-Path $frontendHtml) {
    $content = Get-Content $frontendHtml
    $content = $content -replace [regex]::Escape($CurrentCDN), $BackblazeUrl
    $content = $content -replace [regex]::Escape($LocalCDN), $BackblazeUrl
    $content | Set-Content $frontendHtml
    Write-Host "✅ Updated frontend/public/index.html" -ForegroundColor Green
}
else {
    Write-Host "❌ frontend/public/index.html not found" -ForegroundColor Red
}

# Update frontend/build/index.html if it exists
$buildHtml = "frontend/build/index.html"
if (Test-Path $buildHtml) {
    $content = Get-Content $buildHtml
    $content = $content -replace [regex]::Escape($CurrentCDN), $BackblazeUrl
    $content = $content -replace [regex]::Escape($LocalCDN), $BackblazeUrl
    $content | Set-Content $buildHtml
    Write-Host "✅ Updated frontend/build/index.html" -ForegroundColor Green
}
else {
    Write-Host "⚠️ frontend/build/index.html not found (this is normal if you haven't built yet)" -ForegroundColor Yellow
}

# Update index.html in root if it exists
$rootHtml = "index.html"
if (Test-Path $rootHtml) {
    $content = Get-Content $rootHtml
    $content = $content -replace [regex]::Escape($CurrentCDN), $BackblazeUrl
    $content = $content -replace [regex]::Escape($LocalCDN), $BackblazeUrl
    $content | Set-Content $rootHtml
    Write-Host "✅ Updated index.html" -ForegroundColor Green
}
else {
    Write-Host "⚠️ index.html not found in root" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 CDN URL update complete!" -ForegroundColor Green