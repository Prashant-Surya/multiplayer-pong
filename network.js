var player_name = prompt('Please enter your name');
var socket = io('http://localhost:8123');
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
    $('#active_players').append('<li id="' +data['player_id'] + '">' + data['player_name'] +"</li>" );
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
});
