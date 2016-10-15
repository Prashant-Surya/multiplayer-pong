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
//        if (player instanceof BotPlayer) {
            y = width / 2;
 //       }
    }else if(news == 'S'){
        y = Math.floor(Math.random() * (width-pad_height) + 1) + pad_height/2;
        x = height - player.get_pad_width()/2;
   //     if (player instanceof BotPlayer) {
            y = width / 2;
    //}

    }else if(news == 'E'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = width - player.get_pad_width()/2;
     //   if (player instanceof BotPlayer) {
            x = height / 2;
   // }
    }else if(news = 'W'){
        x = Math.floor(Math.random() * (height-pad_height) + 1) + pad_height/2;
        y = player.get_pad_width()/2;
    //    if (player instanceof BotPlayer) {
                        x = height / 2;
   // }
    }
    player.set_x(x);
    player.set_y(y);
}


function Player(news, color, player_id, name){
    this.color = color;
    this.player_id = player_id;
    this.news = news;
    this.name = name;
    this.pad_width = 20;
    this.pad_height = 100;
    this.speed = 50;
    this.top_left_corner = {
        'W': {
            'x': -(this.pad_height)/2,
            'y': -(this.pad_width)/2,
            'height': this.pad_height,
            'width': this.pad_width,
            'text_x' : 0,
            'text_y' : this.pad_width / 2 + 5
        },
        'S':{
            'x': -(this.pad_width)/2,
            'y': -(this.pad_height)/2,
            'width': this.pad_height,
            'height': this.pad_width,
            'text_x' : - this.pad_width / 2 - 5,
            'text_y' : 0
        },
        'N':{
            'x': -(this.pad_width)/2,
            'y': -(this.pad_height)/2,
            'width': this.pad_height,
            'height': this.pad_width,
            'text_x' :this.pad_width /2 + 25,
            'text_y' : 0
        },
        'E':{
            'x': -(this.pad_height)/2,
            'y': -(this.pad_width)/2,
            'height': this.pad_height,
            'width': this.pad_width,
            'text_x' : 0,
            'text_y' : - this.pad_width / 2 -40
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
        context.font = "27px serif"
        context.fillStyle = "black";
        context.fillText(this.name,  this.y + this.top_left_corner[this.news]['text_y'], this.x + this.top_left_corner[this.news]['text_x']);

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


var BotPlayer = function(news, color, player_id,name) {
    Player.call(this,news, color, player_id, name);
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

    this.isCrossing = function() {
        if (this.news == 'N' || this.news == 'S') {
            if (new_game.ball.y < this.pad_height / 2 || new_game.ball.y > gameWindow.get_width() - this.pad_height / 2) {
                return true;
            } else {
                return false;
            }
        } else {
            if (new_game.ball.x < this.pad_height / 2 || new_game.ball.x > gameWindow.get_height() - this.pad_height / 2) {
                return true;
            } else {
                return false;
            }
        }
    }
}

var HumanPlayer = function(news, color, player_id,name) {
    Player.call(this,news, color, player_id,name);
};

BotPlayer.prototype = Object.create(Player.prototype);
BotPlayer.prototype.constructor = BotPlayer;
HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.constructor = HumanPlayer;


function Ball() {
    this.radius = 10;
    this.color  = 'white';
    this.velocity_x = 5;
    this.velocity_y = 6;
    this.x = gameWindow.get_height() / 2;
    this.y = gameWindow.get_width() / 2;

    this.draw = function() {
        context = gameWindow.get_context();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc( this.y, this.x, this.radius, 0, Math.PI * 2, true);
        context.fill();
    }

    this.move = function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }
}

function game(players, currentPlayer, isSinglePlayer){
    this.currentPlayer = currentPlayer;
    this.ball = null;
    this.players = players;
    this.isSinglePlayer = isSinglePlayer;
    this.initialize = function(){
        this.ball = new Ball();
        this.ball.draw();
        for(var i=0; i<4; i++){
            set_initial_position(this.players[i]);
            this.players[i].draw();
        }

        window.addEventListener('keydown', function (event) {
            var moved = false;
            if (currentPlayer.news == 'N' || currentPlayer.news == 'S') {
                if (event.keyCode == 37) {
                    currentPlayer.move(-1);
                    moved = true;
                } else if (event.keyCode == 39) {
                    currentPlayer.move(1);
                    moved = true;
                }
            } else {
                if (event.keyCode == 40) {
                    currentPlayer.move(1);
                    moved = true;
                } else if (event.keyCode == 38) {
                    currentPlayer.move(-1);
                    moved = true;
                }
            }
            if (moved && !isSinglePlayer) {
                socket.emit('move', {'x' : currentPlayer.x, 'y' : currentPlayer.y , 'player_id' : other_player.player_id});
            }
        });
    }

    this.start = function() {
        var self = this;
        
        var interval = setInterval(function() {
            context = gameWindow.get_context();
            context.clearRect(0,0, gameWindow.get_width(), gameWindow.get_height());
            self.ball.move();
            var isUp_Down = self.checkCollision();
            if (isUp_Down != null) {
                if (isUp_Down == false)
                    self.ball.velocity_y = - self.ball.velocity_y;
                else
                    self.ball.velocity_x = - self.ball.velocity_x;
                self.ball.move();
            }
            self.ball.draw();
            for(var i=0; i<4; i++){
                if (self.players[i] instanceof BotPlayer) {
                    self.players[i].move(1);
                }
                self.players[i].draw();
            }
//            if (self.isGameOver()) {
//                clearInterval(interval);
//                $('.game').hide();
//                show_choose_gameplay();
//                $(".js__p_start").click(function(){
//                    $(".js__popup").css('margin-left','-230px');
//                    $(".js__popup").removeClass('js__slide_top');
//                    $(this).simplePopup();
//                });
//                $(".js__p_start").click();
//                if (!self.isSinglePlayer) {
//                    socket.emit('game_over', {'player_id' : other_player.player_id});
//                }
//
//
//            }
        }, 1000/60);
        
    }

    this.checkCollision = function() {
        var isUp_Down = null;
        for (var i = 0; i < 4; i++) {
            var player = this.players[i];
            var distance = player.pad_height / 2 + this.ball.radius;
            var distance_2 = player.pad_width / 2 + this.ball.radius;
            if (player.news == 'N') {
                if ((this.ball.y > player.y - distance && this.ball.y < player.y + distance) && (this.ball.x - player.x < distance_2)) 
                    isUp_Down = true;
            }
            if (player.news == 'E') {
                if ((this.ball.x > player.x - distance && this.ball.x < player.x + distance) && (player.y - this.ball.y < distance_2)) {
                    isUp_Down = false;
                }
            }
            if (player.news == 'S') {
                if ((this.ball.y > player.y - distance && this.ball.y < player.y + distance) && (player.x - this.ball.x < distance_2)) 
                    isUp_Down = true;
            }
            if (player.news == 'W') {
                if ((this.ball.x > player.x - distance && this.ball.x < player.x + distance) && (this.ball.y - player.y < distance_2)) {
                    isUp_Down = false;
                }
            }

            
        }
        return isUp_Down;
    }

    this.isGameOver = function() {
        if (this.ball.x < 0 || this.ball.x > gameWindow.get_height() || this.ball.y < 0 || this.ball.y > gameWindow.get_width())
            return true;
        else
            return false;
    };
}

