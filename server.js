var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8123);

function handler (req, res) {
  console.log(req.url);
  var url = req.url;
  if (req.url == '/')
    url = '/index.html';
  fs.readFile(__dirname + url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connect', function (socket) {
  console.log('User connected');
});