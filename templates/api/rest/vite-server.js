const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'hello' }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3001, () => {
  console.log('REST server listening on http://localhost:3001');
});