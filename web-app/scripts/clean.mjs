import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToRemove = [
  path.join(__dirname, "../src/app/(ops)/payments"),
  path.join(__dirname, "../src/app/(ops)/settlements")
];

for (const dir of dirsToRemove) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`[CLEANUP] Removed colliding route directory: ${dir}`);
  }
}
