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
var players = {};

io.on('connection', function (socket) {
  var cur_id;
  socket.on('new_user', function(data) {
    players[data['player_id']] = {'player_name' : data['player_name'], 'socket' : socket};
    cur_id = data['player_id'];
    socket.broadcast.emit('new_user', data);
    console.log(players);
  });


  socket.on('disconnect', function() {
    console.log(players[cur_id]['player_name'] + ' logged out');
    delete players[cur_id];
    console.log(players);
  });

});
