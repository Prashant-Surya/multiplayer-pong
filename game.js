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
        if (player instanceof BotPlayer) {
            y = width / 2;
        }
    }else if(news == 'S'){
        y = Math.floor(Math.random() * (width-pad_height) + 1) + pad_height/2;
        x = height - player.get_pad_width()/2;
        if (player instanceof BotPlayer) {
            y = width / 2;
    }

    }else if(news == 'E'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = width - player.get_pad_width()/2;
        if (player instanceof BotPlayer) {
            x = height / 2;
    }
    }else if(news = 'W'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = player.get_pad_width()/2;
        if (player instanceof BotPlayer) {
                        x = height / 2;
    }
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
    this.speed = 5;
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

    this.isCrossing = function() {
        if (this.news == 'N' || this.news == 'S') {
            if (this.y < this.pad_height / 2 || this.y > gameWindow.get_width() - this.pad_height / 2) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.x < this.pad_height / 2 || this.x > gameWindow.get_height() - this.pad_height / 2) {
                return true;
            } else {
                return false;
            }
        }
    }
    this.move = function(direction) {
        if (this.news == 'N' || this.news == 'S') {
            this.y += direction * this.speed;
            if (this.isCrossing()) {
                this.y -= direction * this.speed;
            }
        } else {
            this.x += direction * this.speed;
            if (this.isCrossing()) {
                this.x -= direction * this.speed;
            }
        }

        this.draw();
    }
}


var BotPlayer = function(news, color, player_id) {
    Player.call(this,news, color, player_id);
    this.move = function(direction) {
        if (this.news == 'N' || this.news == 'S') {
            if (!this.isCrossing()) {
                this.y = new_game.ball.y;
            }
        }
        else {
            
            if (!this.isCrossing()) {
                this.x = new_game.ball.x;
            }
        }
    }
}

var HumanPlayer = function(news, color, player_id) {
    Player.call(this,news, color, player_id);
};

BotPlayer.prototype = Object.create(Player.prototype);
BotPlayer.prototype.constructor = BotPlayer;
HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.constructor = HumanPlayer;


function Ball() {
    this.radius = 10;
    this.color  = 'black';
    this.velocity_x = 5;
    this.velocity_y = 5;
    this.x = gameWindow.get_width() / 2;
    this.y = gameWindow.get_height() / 2;

    this.draw = function() {
        context = gameWindow.get_context();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc( this.x, this.y,this.radius, 0, Math.PI * 2, true);
        context.fill();
    }

    this.move = function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }
}

function game(){
    this.currentPlayer = null;
    this.ball = null;
    this.players = null;
    this.initialize = function(){
        player1 = new HumanPlayer('N', 'blue',1);
        player2 = new BotPlayer('E', 'green',2);
        player3 = new BotPlayer('W', 'red',3);
        player4 = new BotPlayer('S', 'yellow',4);
        this.players= [player1,player2,player3,player4];
        this.ball = new Ball();
        for(var i=0; i<4; i++){
                set_initial_position(this.players[i]);
        }

        currentPlayer = player1;
        window.addEventListener('keydown', function (event) {
            if (currentPlayer.news == 'N' || currentPlayer.news == 'S') {
                if (event.keyCode == 37) {
                    currentPlayer.move(-1);
                } else if (event.keyCode == 39) {
                    currentPlayer.move(1);
                }
            } else {
                if (event.keyCode == 40) {
                    currentPlayer.move(1);
                } else if (event.keyCode == 38) {
                    currentPlayer.move(-1);
                }
            }
        });
        var self = this;
        
        setInterval(function() {
            context = gameWindow.get_context();
            context.clearRect(0,0, gameWindow.get_width(), gameWindow.get_height());
            self.ball.move();
            self.ball.draw();
            for(var i=0; i<4; i++){
            if (self.players[i] instanceof BotPlayer) {
                self.players[i].move(1);
            }
            self.players[i].draw();
        }
        }, 1000/60);
        
    }
}
new_game = new game();
new_game.initialize();
