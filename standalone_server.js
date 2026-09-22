const fs = require('fs');
const path = require('path');

// 1. Auto-load .env into process.env before anything else
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  });
}

// 2. Error logger
const origError = console.error;
console.error = function(...args) {
  try {
    fs.appendFileSync(path.join(__dirname, 'server_debug.log'), `[${new Date().toISOString()}] ${args.map(a => (a && a.stack) ? a.stack : String(a)).join(' ')}\n`);
  } catch(e) {}
  origError.apply(console, args);
};

process.env.NODE_ENV = 'production';
process.chdir(__dirname);

const currentPort = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

const { startServer } = require('next/dist/server/lib/start-server');
const nextConfig = require('./.next/required-server-files.json').config;

startServer({
  dir: __dirname,
  isDev: false,
  config: nextConfig,
  hostname,
  port: isNaN(currentPort) ? currentPort : parseInt(currentPort, 10),
  allowRetry: false,
}).catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});

