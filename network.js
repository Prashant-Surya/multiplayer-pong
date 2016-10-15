var player_name = prompt('Please enter your name');
var socket = io('http://' + window.location.hostname + ':8123');
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var players = {};
var player_id = guid();
socket.emit('new_user', {'player_name': player_name, 'player_id' : player_id});

function add_user(data) {
    $('#active_players').append('<li id="' +data['player_id'] + '"><div></div><span>' + data['player_name'] +"<span></li>" );
    if (data['status'] == 'free') {
        $('#' + data['player_id']).removeClass('busy');
        $('#' + data['player_id']).addClass('available');
    } else {
        $('#' + data['player_id']).removeClass('available');
        $('#' + data['player_id']).addClass('busy');
    }
    $('body').on('click','#' + data['player_id'], function(){
        socket.emit('wanna_play', {'player_id' : $(this).attr('id')});
    });
}

socket.on('new_user', function(data) {
    players[data['player_id']] = data['player_name'];
    console.log(data['player_name'] + ' logged in.');
    add_user(data);

});

socket.on('wanna_play', function(data) {
    console.log(players[data['player_id']] + ' wants to play with ' + player_name);
    var ans = confirm(players[data['player_id']] + ' wants to play with you.\nDo you want to play?');
    if (ans) {
      socket.emit('yes', data);
    } else {
      socket.emit('decline', data);
    }
});


socket.on('decline', function(data) {
  console.log(players[data['player_id']] + ' declined your request.' );
});

var other_player;
var cur_player;
socket.on("start_game", function(data) {
  console.log('yes');
  var players_data = data['players'];
  $('.sidebar').hide();
  $('.game').show();
  players_list = [];
  colors_list = ['red', 'blue'];
  player1 = new HumanPlayer(players_data['1']['news'], 'red', players_data['1']['player_id']);
  player2 = new HumanPlayer(players_data['2']['news'], 'blue', players_data['2']['player_id']);
  player3 = new BotPlayer('E', 'green',3);
  player4 = new BotPlayer('W', 'yellow',4);
  players_list.push(player1);
  players_list.push(player2);
  players_list.push(player3);
  players_list.push(player4);
  if (player1.player_id == player_id) {
    new_game = new game(players_list, player1, false);
    other_player = player2;
    cur_player = player1;
  }
  else {
    new_game = new game(players_list, player2, false);
    other_player = player1;
    cur_player = player2;
  }
  new_game.initialize();

  $('#color').text(cur_player.color);
  setTimeout(function() {
            new_game.start();
        }, 1000);

});

socket.on('delete' , function(data) {
  console.log('disconnect ' + data);
  $('#' + data['player_id']).remove();
  delete players[data['player_id']];
});

socket.on('move', function(data) {
  other_player.x = data['x'];
  other_player.y = data['y'];
});

socket.on('busy', function(data) {
  $('#' + data['player_id']).removeClass('available');
  $('#' + data['player_id']).addClass('busy');
});


socket.on('free', function(data) {
  $('#' + data['player_id']).removeClass('busy');
  $('#' + data['player_id']).addClass('available');
});