/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/start.js
const { spawnSync } = require('child_process');

const nextBin = require.resolve('next/dist/bin/next');
const env = { ...process.env, NODE_ENV: 'production' };

const result = spawnSync(process.execPath, [nextBin, 'start'], {
  stdio: 'inherit',
  env,
});

if (result.error) {
  console.error('Start execution failed:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
