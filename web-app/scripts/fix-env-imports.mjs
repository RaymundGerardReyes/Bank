import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir(rootDir, function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /@\/config\/env/g;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, '@/server/config/env');
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`Updated imports in: ${filePath}`);
    }
  }
});

console.log(`\nSuccessfully updated ${modifiedCount} files.`);

// Delete the old config file
const oldEnvPath = path.join(rootDir, 'config', 'env.ts');
if (fs.existsSync(oldEnvPath)) {
  fs.unlinkSync(oldEnvPath);
  console.log(`\nDeleted old env config: ${oldEnvPath}`);
  
  // Try to remove the config folder if it's empty
  try {
    fs.rmdirSync(path.join(rootDir, 'config'));
    console.log(`Removed empty config directory.`);
  } catch (e) {
    // Ignore if not empty
  }
}
