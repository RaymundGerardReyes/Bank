import os from 'os';
import { execSync, spawn } from 'child_process';

// 1. Detect active LAN/Wi-Fi IPv4 address
function getLanIp() {
  const ifaces = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(ifaces)) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        // Exclude link-local (169.254.x.x) and WSL/Hyper-V (172.x.x.x)
        if (!addr.address.startsWith('169.254.') && !addr.address.startsWith('172.')) {
          return { name, ip: addr.address };
        }
      }
    }
  }
  return null;
}

// 2. Clean up any orphaned process on port 8081
function freePort8081() {
  try {
    const output = execSync('netstat -ano | findstr :8081', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid) && pid !== '0') {
          console.log(`[Metro] Freeing port 8081 (killing orphaned PID ${pid})...`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      }
    }
  } catch {
    // Port is already free
  }
}

const lanInfo = getLanIp();
const lanIp = lanInfo ? lanInfo.ip : '127.0.0.1';

console.log(`[Metro] Detected LAN Interface: ${lanInfo ? lanInfo.name : 'Loopback'} (${lanIp})`);
console.log(`[Metro] Setting REACT_NATIVE_PACKAGER_HOSTNAME=${lanIp}`);

freePort8081();

const args = process.argv.slice(2);
const defaultArgs = args.length > 0 ? args : ['start', '--lan', '--go'];

const child = spawn('npx', ['expo', ...defaultArgs], {
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
  },
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

