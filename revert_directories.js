const fs = require('fs');
const path = require('path');

const baseTestDir = path.join(__dirname, 'backend', 'src', 'test', 'java');
const integrationDir = path.join(__dirname, 'backend', 'src', 'integrationTest', 'java');
const e2eDir = path.join(__dirname, 'backend', 'src', 'e2eTest', 'java');

function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

function processDirectory(sourceDir) {
    if (!fs.existsSync(sourceDir)) return;
    
    const items = fs.readdirSync(sourceDir);
    for (const item of items) {
        const fullPath = path.join(sourceDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.java')) {
            const relativePath = path.relative(sourceDir, fullPath);
            const targetPath = path.join(baseTestDir, relativePath);
            
            ensureDirectoryExists(targetPath);
            fs.renameSync(fullPath, targetPath);
            console.log(`Reverted: ${relativePath}`);
        }
    }
}

console.log('Reverting directories to original state...');
processDirectory(integrationDir);
processDirectory(e2eDir);
console.log('Done.');
