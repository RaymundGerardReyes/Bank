# organize-frontend.ps1
# Run this script from the root of your web-app folder: .\organize-frontend.ps1

Write-Host "Starting Frontend Codebase Reorganization..." -ForegroundColor Cyan

$appDir = "src\app"
$compDir = "src\components"

# 1. Setup the new architecture root groups
Write-Host "Creating Route Groups..."
if (-Not (Test-Path "$appDir\(public)")) { New-Item -ItemType Directory -Path "$appDir\(public)" | Out-Null }
if (-Not (Test-Path "$appDir\(portals)")) { New-Item -ItemType Directory -Path "$appDir\(portals)" | Out-Null }
if (-Not (Test-Path "$compDir\ui")) { New-Item -ItemType Directory -Path "$compDir\ui" | Out-Null }
if (-Not (Test-Path "$compDir\features")) { New-Item -ItemType Directory -Path "$compDir\features" | Out-Null }
if (-Not (Test-Path "$compDir\layout")) { New-Item -ItemType Directory -Path "$compDir\layout" | Out-Null }

# 2. Consolidate Portals
Write-Host "Moving authenticated portals into (portals)..."
$portals = @("(admin)", "(auth)", "(dashboard)", "(merchant)", "(ops)")
foreach ($portal in $portals) {
    if (Test-Path "$appDir\$portal") {
        Move-Item -Path "$appDir\$portal" -Destination "$appDir\(portals)\" -Force
        Write-Host "  Moved $portal"
    }
}

# 3. Consolidate Public Routes
Write-Host "Moving public routes into (public)..."
if (Test-Path "$appDir\developers") {
    Move-Item -Path "$appDir\developers" -Destination "$appDir\(public)\" -Force
}
if (Test-Path "$appDir\(checkout)") {
    Move-Item -Path "$appDir\(checkout)" -Destination "$appDir\(public)\" -Force
}
# Move landing page to (public) to keep root ultra-clean
if (Test-Path "$appDir\page.tsx") {
    Move-Item -Path "$appDir\page.tsx" -Destination "$appDir\(public)\" -Force
}

# 4. Clean up Redundancy (Delete old duplicate checkout folder if it exists)
if (Test-Path "$appDir\checkout") {
    Write-Host "Removing redundant checkout folder..." -ForegroundColor Yellow
    Remove-Item -Path "$appDir\checkout" -Recurse -Force
}

# 5. Restructure Components
Write-Host "Reorganizing components..."
# Move generic UI components to /ui
if (Test-Path "$compDir\common") {
    Move-Item -Path "$compDir\common\*" -Destination "$compDir\ui\" -Force
    Remove-Item -Path "$compDir\common" -Force
}
# Move domain features to /features
$features = @("accounts", "api", "checkout", "gateway", "payments", "transactions")
foreach ($feature in $features) {
    if (Test-Path "$compDir\$feature") {
        Move-Item -Path "$compDir\$feature" -Destination "$compDir\features\" -Force
    }
}

Write-Host "Frontend Codebase successfully reorganized!" -ForegroundColor Green
Write-Host "Please review the imports in your IDE (Next.js/TypeScript aliases @/components should automatically resolve, but you may need to restart the TS server)."
