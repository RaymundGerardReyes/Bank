import { promises as fs } from 'fs';
import { join } from 'path';

const importMappings = [
  { old: '@/components/payments/', new: '@/components/features/payments/' },
  { old: '@/components/transactions/', new: '@/components/features/transactions/' },
  { old: '@/components/common/', new: '@/components/ui/' },
  { old: '@/components/gateway/', new: '@/components/features/gateway/' },
  { old: '@/components/api/', new: '@/components/features/api/' },
  { old: '@/components/checkout/', new: '@/components/features/checkout/' }
];

async function fixRemainingErrors(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await fixRemainingErrors(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = await fs.readFile(fullPath, 'utf8');
      let isModified = false;

      // 1. Fix absolute imports that were missed (since the first script only ran on src/app)
      for (const mapping of importMappings) {
        if (content.includes(mapping.old)) {
          content = content.replaceAll(mapping.old, mapping.new);
          isModified = true;
        }
      }

      // 2. Fix relative imports pointing to the old 'common' folder
      const relativeCommonRegex = /(?:\.\.\/)+common\//g;
      if (relativeCommonRegex.test(content)) {
        content = content.replace(relativeCommonRegex, '@/components/ui/');
        isModified = true;
      }

      // 3. Fix the default vs. named export error for PaymentMethodSelector
      if (content.includes('import PaymentMethodSelector from')) {
        content = content.replace(
          'import PaymentMethodSelector from',
          'import { PaymentMethodSelector } from'
        );
        isModified = true;
      }

      if (isModified) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`✅ Fixed: ${fullPath}`);
      }
    }
  }
}

console.log('Scanning for relative imports, missed absolute imports, and export mismatches...');
fixRemainingErrors('./src')
  .then(() => console.log('✨ Clean-up complete!'))
  .catch(console.error);
