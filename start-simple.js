// Simple launcher that doesn't require tsx
import { spawn } from 'child_process';

console.log('Starting EdConnect...');
console.log('If this fails, you need Node.js v20 instead of v24');
console.log('');

// Try to run with tsx first
const child = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start:', err.message);
  console.log('\nTry running: npm run build && npm run start');
});
