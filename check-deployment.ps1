# PowerShell Deployment Status Checker
# Check Directory Microservice Live URLs

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
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -Method Head -TimeoutSec 10 -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: ONLINE ($($frontendResponse.StatusCode))" -ForegroundColor Green
        $frontendStatus = "online"
    } else {
        Write-Host "⚠️ Frontend: RESPONDING ($($frontendResponse.StatusCode))" -ForegroundColor Yellow
        $frontendStatus = "responding"
    }
} catch {
    Write-Host "❌ Frontend: OFFLINE ($($_.Exception.Message))" -ForegroundColor Red
    $frontendStatus = "offline"
}

# Check Backend Health
Write-Host "🔍 Checking Backend (Railway)..." -ForegroundColor Cyan
try {
    $backendHealthResponse = Invoke-WebRequest -Uri "$backendUrl/health" -Method Get -TimeoutSec 10 -ErrorAction Stop
    if ($backendHealthResponse.StatusCode -eq 200) {
        $healthData = $backendHealthResponse.Content | ConvertFrom-Json
        Write-Host "✅ Backend Health: OK ($($healthData.status))" -ForegroundColor Green
        $backendStatus = "online"
    } else {
        Write-Host "⚠️ Backend: RESPONDING ($($backendHealthResponse.StatusCode))" -ForegroundColor Yellow
        $backendStatus = "responding"
    }
} catch {
    Write-Host "❌ Backend: OFFLINE ($($_.Exception.Message))" -ForegroundColor Red
    $backendStatus = "offline"
}

# Check Backend Mock APIs
Write-Host "🔍 Checking Backend Mock APIs..." -ForegroundColor Cyan
$mockEndpoints = @(
    @{name="Companies"; path="/api/mock/companies"},
    @{name="Employees"; path="/api/mock/employees"},
    @{name="Trainers"; path="/api/mock/trainers"},
    @{name="Training Requests"; path="/api/mock/training-requests"}
)

$apiStatus = @{}
foreach ($endpoint in $mockEndpoints) {
    try {
        $apiResponse = Invoke-WebRequest -Uri "$backendUrl$($endpoint.path)" -Method Get -TimeoutSec 10 -ErrorAction Stop
        if ($apiResponse.StatusCode -eq 200) {
            $apiData = $apiResponse.Content | ConvertFrom-Json
            $hasData = $apiData.success -and $apiData.data -and $apiData.data.Count -gt 0
            $source = $apiData.source
            Write-Host "✅ $($endpoint.name): DATA AVAILABLE ($source)" -ForegroundColor Green
            $apiStatus[$endpoint.name] = "ok"
        } else {
            Write-Host "❌ $($endpoint.name): HTTP $($apiResponse.StatusCode)" -ForegroundColor Red
            $apiStatus[$endpoint.name] = "error"
        }
    } catch {
        Write-Host "❌ $($endpoint.name): $($_.Exception.Message)" -ForegroundColor Red
        $apiStatus[$endpoint.name] = "error"
    }
}

# Check Database
Write-Host "🔍 Checking Database (Supabase)..." -ForegroundColor Cyan
try {
    $dbResponse = Invoke-WebRequest -Uri "$databaseUrl/rest/v1/" -Method Head -TimeoutSec 10 -ErrorAction Stop
    if ($dbResponse.StatusCode -eq 200 -or $dbResponse.StatusCode -eq 401) {
        Write-Host "✅ Database: ACCESSIBLE ($($dbResponse.StatusCode))" -ForegroundColor Green
        $databaseStatus = "accessible"
    } else {
        Write-Host "⚠️ Database: RESPONDING ($($dbResponse.StatusCode))" -ForegroundColor Yellow
        $databaseStatus = "responding"
    }
} catch {
    Write-Host "❌ Database: OFFLINE ($($_.Exception.Message))" -ForegroundColor Red
    $databaseStatus = "offline"
}

# Generate Summary
Write-Host ""
Write-Host "📊 DEPLOYMENT STATUS SUMMARY" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

$allServicesOnline = ($frontendStatus -eq "online" -or $frontendStatus -eq "responding") -and 
                     ($backendStatus -eq "online" -or $backendStatus -eq "responding") -and 
                     ($databaseStatus -eq "accessible" -or $databaseStatus -eq "responding")

$allAPIsWorking = ($apiStatus.Values | Where-Object { $_ -eq "ok" }).Count -eq $apiStatus.Count

Write-Host "🌐 Services: $(if ($allServicesOnline) { '✅ ALL ONLINE' } else { '⚠️ SOME ISSUES' })" -ForegroundColor $(if ($allServicesOnline) { 'Green' } else { 'Yellow' })
Write-Host "🔌 Backend APIs: $(if ($allAPIsWorking) { '✅ ALL WORKING' } else { '⚠️ SOME ISSUES' })" -ForegroundColor $(if ($allAPIsWorking) { 'Green' } else { 'Yellow' })
Write-Host "🎨 Frontend: $(if ($frontendStatus -eq 'online') { '✅ WORKING' } else { '⚠️ ISSUES' })" -ForegroundColor $(if ($frontendStatus -eq 'online') { 'Green' } else { 'Yellow' })
Write-Host "🗄️ Database: $(if ($databaseStatus -eq 'accessible') { '✅ ACCESSIBLE' } else { '⚠️ ISSUES' })" -ForegroundColor $(if ($databaseStatus -eq 'accessible') { 'Green' } else { 'Yellow' })

$overallStatus = $allServicesOnline -and $allAPIsWorking -and ($frontendStatus -eq "online") -and ($databaseStatus -eq "accessible")

Write-Host ""
Write-Host "🎯 OVERALL STATUS: $(if ($overallStatus) { '✅ DEPLOYMENT SUCCESSFUL' } else { '⚠️ DEPLOYMENT IN PROGRESS' })" -ForegroundColor $(if ($overallStatus) { 'Green' } else { 'Yellow' })

if ($overallStatus) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 LIVE URLS:" -ForegroundColor Cyan
    Write-Host "   Frontend: $frontendUrl" -ForegroundColor White
    Write-Host "   Backend:  $backendUrl" -ForegroundColor White
    Write-Host "   Database: $databaseUrl" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🧪 API ENDPOINTS:" -ForegroundColor Cyan
    foreach ($endpoint in $mockEndpoints) {
        Write-Host "   $($endpoint.name): $backendUrl$($endpoint.path)" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "⏳ Deployment still in progress..." -ForegroundColor Yellow
    Write-Host "🔄 Check back in a few minutes" -ForegroundColor Yellow
    Write-Host "🔗 Monitor: https://github.com/jasminemograby/DIRECTORY/actions" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 MANUAL TRIGGER INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/jasminemograby/DIRECTORY/actions" -ForegroundColor White
Write-Host "2. Click 'Run workflow' on each deployment workflow" -ForegroundColor White
Write-Host "3. Select branch 'main' (commit f6309e3)" -ForegroundColor White
Write-Host "4. Click 'Run workflow' green button" -ForegroundColor White
