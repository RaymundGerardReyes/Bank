Write-Host "=== NovaBank WSL & Docker Desktop Recovery ===" -ForegroundColor Cyan

Write-Host "[1/5] Stopping Docker and WSL Services..." -ForegroundColor Yellow
Stop-Service -Name com.docker.service -Force -ErrorAction SilentlyContinue
Stop-Service -Name WSLService -Force -ErrorAction SilentlyContinue

Write-Host "[2/5] Force killing any lingering vmmem processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -match "vmmem|wsl" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "[3/5] Starting WSL Service..." -ForegroundColor Yellow
Start-Service -Name WSLService -ErrorAction Stop

Write-Host "[4/5] Starting Docker Service..." -ForegroundColor Yellow
Start-Service -Name com.docker.service -ErrorAction SilentlyContinue

Write-Host "[5/5] Re-verifying WSL responsiveness..." -ForegroundColor Yellow
$status = wsl.exe -l -v
$status | Out-Host

Write-Host "`n=== WSL & Docker Recovery Complete! ===" -ForegroundColor Green
Start-Sleep -Seconds 3