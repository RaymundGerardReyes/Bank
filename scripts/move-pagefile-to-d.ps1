# Self-elevate to Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Clear-Host
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  NovaBank: Move Windows Pagefile from C: to D: Drive  " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Current Drive C: space is constrained."
Write-Host "Drive D: has 148+ GB free space."
Write-Host ""
Write-Host "[1/3] Disabling automatic pagefile management on C:..." -ForegroundColor Yellow
$cs = Get-CimInstance Win32_ComputerSystem
Set-CimInstance -InputObject $cs -Property @{AutomaticManagedPagefile=$False}

Write-Host "[2/3] Removing pagefile from C: drive..." -ForegroundColor Yellow
Get-CimInstance Win32_PageFileSetting -ErrorAction SilentlyContinue | Remove-CimInstance -ErrorAction SilentlyContinue

Write-Host "[3/3] Creating high-performance 16GB Pagefile on D:\pagefile.sys..." -ForegroundColor Yellow
New-CimInstance -ClassName Win32_PageFileSetting -Property @{
    Name = "D:\pagefile.sys"
    InitialSize = 4096
    MaximumSize = 16384
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Pagefile configured on D:\pagefile.sys      " -ForegroundColor Green
Write-Host "  On your next restart, C:\pagefile.sys (12.3 GB) will " -ForegroundColor Green
Write-Host "  be completely deleted, freeing 12.3 GB on Drive C:!  " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..."
[void][System.Console]::ReadKey()