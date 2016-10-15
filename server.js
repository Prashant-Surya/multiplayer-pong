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
      socket.emit('new_user', {'player_name' : players[key]['player_name'], 'player_id' : key, 'status' : players[key]['status']});
    }
    players[data['player_id']] = {'player_name' : data['player_name'], 'status' : 'free', 'socket' : socket};
    cur_id = data['player_id'];
    data['status'] = 'free';
    socket.broadcast.emit('new_user', data);
    console.log(players);
  });


  socket.on('disconnect', function() {
    delete players[cur_id];
    //for (key in players) {
    //  players[key]['socket'].emit('delete', {'player_id' : cur_id});
   // }
    socket.broadcast.emit('delete', {'player_id' : cur_id});
    console.log(players);
  });

  socket.on('wanna_play', function(data) {
    var other_player_id = data['player_id'];
    players[other_player_id]['socket'].emit('wanna_play', {'player_id' : cur_id});
  });

  socket.on('decline', function(data) {
    players[data['player_id']]['socket'].emit('decline', {'player_id' : cur_id});
  });

  socket.on("yes", function(data) {
    new_data = {'1':
      {'player_id': cur_id,
        'news': 'N' 
      },
      '2':
      {'player_id': data['player_id'],
        'news': 'S' 
      }
    }
    players[data['player_id']]['socket'].emit('start_game', {'players': new_data});
    socket.emit('start_game', {'players': new_data});
    for (key in players) {
      if (key != cur_id && key != data['player_id']) {
        players[key]['socket'].emit('busy', {'player_id' : cur_id});
        players[key]['socket'].emit('busy', {'player_id' : data['player_id']});
      }
    }
  });

socket.on('move', function(data) {
  players[data['player_id']]['socket'].emit('move', data);
  
});

socket.on('game_over', function(data) {
for (key in players) {
      if (key != cur_id && key != data['player_id']) {
        players[key]['socket'].emit('free', {'player_id' : cur_id});
        players[key]['socket'].emit('free', {'player_id' : data['player_id']});
      }
    }
});

});
