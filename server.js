const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 5000;
const cache = {};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  const isHtmlFile = extname === '.html';
  const isJsFile = extname === '.js';

  if (!isHtmlFile && !isJsFile && cache[filePath] && !req.headers['cache-control']) {
    res.writeHead(200, cache[filePath].headers);
    res.end(cache[filePath].content);
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      
      if (acceptEncoding.includes('gzip') && extname.match(/\.(html|css|js|json)$/)) {
        zlib.gzip(content, (err, zipped) => {
          let headers;
          if (isHtmlFile || isJsFile) {
            headers = {
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'Vary': 'Accept-Encoding'
            };
          } else {
            headers = {
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Cache-Control': 'max-age=86400',
              'Vary': 'Accept-Encoding'
            };
            cache[filePath] = { content: zipped, headers };
          }
          res.writeHead(200, headers);
          res.end(zipped);
        });
      } else {
        let headers;
        if (isHtmlFile || isJsFile) {
          headers = {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          };
        } else {
          headers = {
            'Content-Type': contentType,
            'Cache-Control': 'max-age=86400'
          };
          cache[filePath] = { content, headers };
        }
        res.writeHead(200, headers);
        res.end(content);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});