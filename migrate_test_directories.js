const fs = require('fs');
const path = require('path');

const baseTestDir = path.join(__dirname, 'backend', 'src', 'test', 'java');
const integrationDir = path.join(__dirname, 'backend', 'src', 'integrationTest', 'java');
const e2eDir = path.join(__dirname, 'backend', 'src', 'e2eTest', 'java');

const e2eFiles = [
    'FinancialIntegrityIT.java',
    'GatewayAuditIntegrityIT.java',
    'TransferFlowIT.java',
    'MerchantWebhookDeliveryIntegrityIT.java',
    'MerchantWebhookContractIT.java'
];

function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

function processDirectory(currentPath) {
    if (!fs.existsSync(currentPath)) return;
    
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.java')) {
            const relativePath = path.relative(baseTestDir, fullPath);
            
            if (e2eFiles.includes(item)) {
                // Move to E2E
                const targetPath = path.join(e2eDir, relativePath);
                ensureDirectoryExists(targetPath);
                fs.renameSync(fullPath, targetPath);
                console.log(`Moved to E2E: ${relativePath}`);
            } else if (item.endsWith('IT.java')) {
                // Move to Integration
                const targetPath = path.join(integrationDir, relativePath);
                ensureDirectoryExists(targetPath);
                fs.renameSync(fullPath, targetPath);
                console.log(`Moved to Integration: ${relativePath}`);
            }
            // *Test.java remains in src/test/java (Unit tests)
        }
    }
}

console.log('Starting Test Directory Migration...');
processDirectory(baseTestDir);
console.log('Migration Complete. Please update build.gradle to use Gradle Source Sets.');
