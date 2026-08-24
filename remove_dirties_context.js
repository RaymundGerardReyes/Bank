const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.java')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('backend/src/test/java');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('@DirtiesContext')) {
        // Remove the import
        content = content.replace(/import org\.springframework\.test\.annotation\.DirtiesContext;\r?\n/g, '');
        // Remove the annotation
        content = content.replace(/@DirtiesContext\(classMode = DirtiesContext\.ClassMode\.AFTER_EACH_TEST_METHOD\)\r?\n/g, '');
        content = content.replace(/@DirtiesContext\r?\n/g, ''); // in case of just @DirtiesContext
        
        fs.writeFileSync(file, content, 'utf8');
        console.log('Cleaned:', file);
        modifiedCount++;
    }
});

console.log(`Finished processing. Modified ${modifiedCount} files.`);
