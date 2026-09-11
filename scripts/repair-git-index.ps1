# scripts/repair-git-index.ps1
# Self-healing utility for Git on Windows to detect and repair truncated 0-byte index files

$indexPath = Join-Path $PSScriptRoot "..\.git\index"

if (Test-Path $indexPath) {
    $item = Get-Item $indexPath -Force
    if ($item.Length -lt 32) {
        Write-Host "Detected corrupted/0-byte .git/index ($($item.Length) bytes). Rebuilding from HEAD..." -ForegroundColor Yellow
        Remove-Item -Force $indexPath
        git reset
        Write-Host ".git/index successfully rebuilt from HEAD!" -ForegroundColor Green
    } else {
        Write-Host ".git/index is healthy ($($item.Length) bytes)." -ForegroundColor Green
    }
} else {
    Write-Host ".git/index missing. Rebuilding from HEAD..." -ForegroundColor Yellow
    git reset
    Write-Host ".git/index successfully restored!" -ForegroundColor Green
}

git status --short

