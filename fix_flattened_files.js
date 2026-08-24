const fs = require('fs');
const path = require('path');

const baseTestDir = path.join(__dirname, 'backend', 'src', 'test', 'java');

function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

function fixFlattenedFiles() {
    if (!fs.existsSync(baseTestDir)) return;
    
    const items = fs.readdirSync(baseTestDir);
    for (const item of items) {
        const fullPath = path.join(baseTestDir, item);
        const stat = fs.statSync(fullPath);
        
        // Only process .java files sitting DIRECTLY in the base directory
        if (stat.isFile() && item.endsWith('.java')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const match = content.match(/^package\s+([\w.]+);/m);
            
            if (match && match[1]) {
                const packagePath = match[1].replace(/\./g, path.sep);
                const targetPath = path.join(baseTestDir, packagePath, item);
                
                ensureDirectoryExists(targetPath);
                fs.renameSync(fullPath, targetPath);
                console.log(`Restored ${item} to ${packagePath}`);
            }
        }
    }
}

console.log('Restoring flattened files to their proper package directories...');
fixFlattenedFiles();
console.log('Done.');
