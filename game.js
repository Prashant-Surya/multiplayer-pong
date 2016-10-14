function GameWindow(){
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.get_context = function(){
        return this.context;
    }
    this.get_width = function(){
        return this.canvas.width;
    }
    this.get_height = function(){
        return this.canvas.height;
    }
}

var gameWindow = new GameWindow();

function set_initial_position(player){
    var height = gameWindow.get_height();
    var width = gameWindow.get_width();
    var x,y;
    var news = player.get_news();
    var pad_height = player.get_pad_height();
    if(news=='N'){
        y = Math.floor(Math.random() * (width-pad_height) + 1) + pad_height/2;
        x = player.get_pad_width()/2;
    }else if(news == 'S'){
        y = Math.floor(Math.random() * (width-pad_height) + 1) + pad_height/2;
        x = height - player.get_pad_width()/2;
    }else if(news == 'E'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = width - player.get_pad_width()/2;
    }else if(news = 'W'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = player.get_pad_width()/2;
    }
    player.set_x(x);
    player.set_y(y);
}


function Player(news, color, player_id){
    this.color = color;
    this.player_id = player_id;
    this.news = news;
    this.pad_width = 10;
    this.pad_height = 100;
    this.top_left_corner = {
        'W': {
            'x': -(this.pad_height)/2,
            'y': -(this.pad_width)/2,
            'height': this.pad_height,
            'width': this.pad_width
        },
        'S':{
            'x': -(this.pad_width)/2,
            'y': -(this.pad_height)/2,
            'width': this.pad_height,
            'height': this.pad_width
        },
        'N':{
            'x': -(this.pad_width)/2,
            'y': -(this.pad_height)/2,
            'width': this.pad_height,
            'height': this.pad_width
        },
        'E':{
            'x': -(this.pad_height)/2,
            'y': -(this.pad_width)/2,
            'height': this.pad_height,
            'width': this.pad_width
        }

    }
    this.set_x = function(x){
        this.x = x;
    }
    this.set_y = function(y){
        this.y = y;
    }
    this.get_news = function(){
        return this.news;
    }
    this.get_pad_height = function(){
        return this.pad_height;
    }
    this.get_pad_width = function(){
        return this.pad_width;
    }
    this.draw =function(){
        var context = gameWindow.get_context();
        var_x = this.x + this.top_left_corner[this.news]['x'];
        var_y = this.y + this.top_left_corner[this.news]['y'];
        context.fillStyle = this.color;
        context.fillRect(var_y, var_x, this.top_left_corner[this.news]['width'], this.top_left_corner[this.news]['height']);
    }
}


function Ball() {
    this.radius = 10;
    this.color  = 'black';

}

function game(){
    this.initialize = function(){
        player1 = new Player('N', 'blue',1);
        player2 = new Player('E', 'green',2);
        player3 = new Player('W', 'red',3);
        player4 = new Player('S', 'yellow',4);
        var players= [player1,player2,player3,player4];
        for(var i=0; i<4; i++){
            set_initial_position(players[i]);
            players[i].draw();
        }
        
    }
}
new_game = new game().initialize();
