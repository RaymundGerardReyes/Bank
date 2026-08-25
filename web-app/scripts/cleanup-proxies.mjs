import fs from "fs";
import path from "path";

const proxyDir = path.join(process.cwd(), "src", "app", "api", "proxy");

// We want to KEEP [...path] and any specific auth routes that we still need.
// However, the catch-all handles EVERYTHING perfectly, so we can delete all directories
// EXCEPT [...path]. Wait, auth/login, auth/logout, auth/refresh are in src/app/api/auth,
// not src/app/api/proxy/auth! Wait, src/app/api/proxy/auth/login just re-exports it.
// It's completely redundant because httpClient routes /auth to /api/auth.
// So we can delete ALL of them EXCEPT [...path]!

const keepDirs = ["[...path]"];

function cleanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (keepDirs.includes(entry.name)) {
                console.log(`Skipping: ${entry.name}`);
                continue;
            }
            
            const fullPath = path.join(dir, entry.name);
            console.log(`Deleting redundant proxy route: ${entry.name}`);
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }
}

cleanDirectory(proxyDir);
console.log("✅ Phase 2: Proxy Cleanup Complete! Only the catch-all [...path] route remains.");
