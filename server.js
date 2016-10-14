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
    
    for (key in players) {
      socket.emit('new_user', {'player_name' : players[key]['player_name'], 'player_id' : key });
    }
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

  socket.on('wanna_play', function(data) {
    var other_player_id = data['player_id'];
    players[other_player_id]['socket'].emit('wanna_play', {'player_id' : cur_id});
  });

});
