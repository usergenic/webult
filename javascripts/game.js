var Game = Class.create();
Game.prototype = {
  
  initialize: function(url) {
    this.commandPrefix=null;
    new Ajax.Request(url, {
      method: 'get',
      onSuccess: function(response) {
        game.gameboard = new Gameboard(game, response.responseText);
        game.start();
      }
    });
  },

  createCharacter: function(type, x, y) {
    var character = new Character();
    character.gameboard=this.gameboard;
    this.gameboard.unionMatrix[y][x]=character;
    character.x=x;
    character.y=y;
    this.characters.push(character);
    character.type=type;
    return character;
  },
  
  generateNpc: function(x, y) {
    if(this.characters.length < 50) {
      var type = 'orc';
      switch(Dice.roll(1,14)) {
        case 1: type = 'spider'; break;
        case 2: type = 'troll';  break;
        case 3: type = 'beholder'; break;
        case 4: type = 'ogre'; break; 
        case 5: type = 'headless'; break;
        case 6: type = 'ettin'; break;
        case 7: type = 'dragon'; break;
        case 8: type = 'wizard'; break;
        case 9: type = 'skeleton'; break;
        case 10: type = 'balrog'; break;
        case 11: type = 'phantom'; break;
      }
      var character = this.createCharacter(type, x, y);
      character.tiles = [type+1,type+2,type+3,type+4];
    }
  },

  start: function() {
    this.characters = [];
    this.fluidClicks = 0;
    this.player = this.createCharacter('player',60,20);
    this.player.tiles=['paladin1','paladin2'];

    whirlpool = this.createCharacter('whirlpool',24,35);
    whirlpool.tiles=['whirlpool1','whirlpool2'];
    whirlpool.swims=true;
    whirlpool.walks=false;

    Keyboard.bind(document);
    Keyboard.observe('keydown','up',function(){game.playerCommand('up')});
    Keyboard.observe('keydown','down',function(){game.playerCommand('down')});
    Keyboard.observe('keydown','left',function(){game.playerCommand('left')});
    Keyboard.observe('keydown','right',function(){game.playerCommand('right')});
    Keyboard.observe('keydown','a',function(){game.playerCommand('attack')});
    Keyboard.observe('keydown','space',function(){game.playerCommand('pass')});

    game.textConsole = new TextConsole($('textconsole'));

    game.npcGenerators = [];
    for(r=0;r<this.gameboard.tileMatrix.length;r++) {
      for(c=0;c<this.gameboard.tileMatrix.length;c++) {
        switch(this.gameboard.tileMatrix[r][c]) {
          case 'dungeon' : game.npcGenerators.push([c,r]);
        }
      }
    }

    // this.render();
    this.activeRender();
    game.textConsole.print("Welcome to Brendan's DHTML Demo, version 0.Alpha");
    game.textConsole.print("You might need to click inside this page for the");
    game.textConsole.print("scripts to pick up on key-presses.  Use your arrow");
    game.textConsole.print("keys to move.  Use the 'A' key, followed by arrow for attack.");
  },

  render: function() {
    this.gameboard.render(this.player.x-10, this.player.y-6, 21, 13);
  },

  activeRender: function() {
    this.render();
    this.fluidClicks++;
    if(this.fluidClicks > 32) this.fluidClicks=1;
    window.setTimeout('game.activeRender()', 300);
  },
  
  move: function(direction) {
    switch(direction) {
      case 'up'   : this.player.move(0,-1); break;
      case 'down' : this.player.move(0, 1); break;
      case 'left' : this.player.move(-1,0); break;
      case 'right': this.player.move( 1,0); break;
    }
    this.turn();
    this.render();
  },
  
  playerCommand: function(command) {
    switch(this.commandPrefix) {
      case 'attack': this.commandPrefix = null;
                     switch(command) {
                       case 'up'   : this.player.attack(0,-1); break;
                       case 'down' : this.player.attack(0, 1); break;
                       case 'left' : this.player.attack(-1,0); break;
                       case 'right': this.player.attack( 1,0); break;
                       default:
                        this.textConsole.print('Nothing');
                     }
                     break;
      default: this.commandPrefix = null;
               switch(command) {
                 case 'pass': this.commandPrefix = null;
                              this.textConsole.print('Pass...');
                              this.turn();
                              break;
                 case 'attack': this.commandPrefix = 'attack'; 
                                this.textConsole.print('Attack - Direction?');
                                break;
                 case 'up':     this.textConsole.print('North');
                                this.move('up');
                                break;
                 case 'down':   this.textConsole.print('South');
                                this.move('down');
                                break;
                 case 'left':   this.textConsole.print('West');
                                this.move('left');
                                break;
                 case 'right':  this.textConsole.print('East');
                                this.move('right');
                                break;
               }
    }
  },
  
  turn: function() {
    for(var c=0;c<this.characters.length;c++) {
      var character=this.characters[c];
      if(character.type != 'player') {
        character[character.mood+'Action']();
      }
    }
    if(Dice.roll(1,10)==1) {
      var xy=this.npcGenerators[Dice.roll(1,this.npcGenerators.length)-1];
      var x=xy[0];
      var y=xy[1];
      if(typeof(this.gameboard.unionMatrix[y][x])=='string') {
        this.generateNpc(x,y);
      }
    }
  }

};

var game = new Game('gameboards/world.txt');
