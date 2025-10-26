# Simple Deployment Status Checker
Write-Host "🚀 DIRECTORY MICROSERVICE - DEPLOYMENT STATUS CHECK" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

$frontendUrl = "https://directory-microservice-frontend.vercel.app"
$backendUrl = "https://directory-microservice-backend.railway.app"
$databaseUrl = "https://directory-microservice.supabase.co"

Write-Host "📋 Checking Live Deployment Status..." -ForegroundColor Yellow
Write-Host ""

# Check Frontend
Write-Host "🔍 Checking Frontend (Vercel)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Frontend: ONLINE ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: OFFLINE" -ForegroundColor Red
}

# Check Backend Health
Write-Host "🔍 Checking Backend (Railway)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method Get -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend: ONLINE ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: OFFLINE" -ForegroundColor Red
}

# Check Database
Write-Host "🔍 Checking Database (Supabase)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$databaseUrl/rest/v1/" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Database: ACCESSIBLE ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Database: OFFLINE" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 LIVE URLS:" -ForegroundColor Cyan
Write-Host "   Frontend: $frontendUrl" -ForegroundColor White
Write-Host "   Backend:  $backendUrl" -ForegroundColor White
Write-Host "   Database: $databaseUrl" -ForegroundColor White

Write-Host ""
Write-Host "📋 MANUAL TRIGGER INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/jasminemograby/DIRECTORY/actions" -ForegroundColor White
Write-Host "2. Click Run workflow on each deployment workflow" -ForegroundColor White
Write-Host "3. Select branch main (commit f6309e3)" -ForegroundColor White
Write-Host "4. Click Run workflow green button" -ForegroundColor White
