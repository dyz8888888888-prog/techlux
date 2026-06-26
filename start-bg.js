const { spawn } = require('child_process');
const server = spawn('node', ['run-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  detached: true
});

server.unref();

console.log('Server started in background');
console.log('Access the site at: http://localhost:3000/');
