// Basic Server: Generated from `.npm-init.js`
var fs = require('fs')
var http = require('http')

var PORT = 8001

http.createServer(function (req, res) {
  //  res.writeHead(200, {'Content-Type': 'text/plain'})
  //  res.end('Hello World!')
  res.end(fs.readFileSync('index.html'))
}).listen(PORT)

console.log('Server running on port: ' + PORT)
