var Game = Class.create();
Game.prototype = {

  initialize: function (url) {
    this.commandPrefix = null;
    this.textConsole = new TextConsole($('textconsole'));
    this.textConsole.print("Loading gameboard...");
    new Ajax.Request(url, {
      method: 'get',
      onSuccess: function (response) {
        $('gameboard').innerHTML = '&nbsp;';
        game.gameboard = new Gameboard(game, response.responseText);
        game.start();
      }
    });
  },

  activeRender: function () {
    this.render();
    this.fluidClicks++;
    if (this.fluidClicks > 16) this.fluidClicks = 1;
    window.setTimeout('game.activeRender()', 300);
  },

  bindKeyboardEvents: function () {
    Keyboard.bind(document);
    Keyboard.observe('keydown', 'up', function () { game.playerCommand('up') });
    Keyboard.observe('keydown', 'down', function () { game.playerCommand('down') });
    Keyboard.observe('keydown', 'left', function () { game.playerCommand('left') });
    Keyboard.observe('keydown', 'right', function () { game.playerCommand('right') });
    Keyboard.observe('keydown', 'a', function () { game.playerCommand('attack') });
    Keyboard.observe('keydown', 'space', function () { game.playerCommand('pass') });
  },

  bringOutYourDead: function () {
    for (c = 0; c < this.characters.length; c++) {
      var character = this.characters[c];
      if (character.dead) {
        this.gameboard.unionMatrix[character.y][character.x] =
          this.gameboard.tileMatrix[character.y][character.x];
        this.characters.splice(c, 1);
        c--;
      }
    }
  },

  createCharacter: function (type, x, y) {
    var character = new Character();
    character.gameboard = this.gameboard;
    this.gameboard.unionMatrix[y][x] = character;
    character.x = x;
    character.y = y;
    this.characters.push(character);
    character.type = type;
    switch (type) {
      case 'squid':
      case 'nixie':
      case 'seahorse':
      case 'seaserpent': character.walks = false; character.swims = true; break;
    }
    return character;
  },

  generateNpc: function (x, y) {

    switch (this.gameboard.tileMatrix[y][x]) {
      case 'deepwater':
      case 'shallowwater':
      case 'water': var environment = 'water'; break;
      default: var environment = 'land';
    }

    if (this.characters.length < 50) {
      switch (environment) {
        case 'land':
          var type = 'orc';
          var tiles = 4;
          switch (Dice.roll(1, 14)) {
            case 1: type = 'spider'; break;
            case 2: type = 'troll'; break;
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
          break;
        case 'water':
          var type = 'squid';
          var tiles = 2;
          switch (Dice.roll(1, 8)) {
            case 1: type = 'nixie'; break;
            case 2: type = 'squid'; break;
            case 3: type = 'seaserpent'; break;
            case 4: type = 'seahorse'; break;
          }
          break;
      }
      var character = this.createCharacter(type, x, y);
      character.mood = 'aggressive';
      character.tiles = [];
      for (var t = 1; t <= tiles; t++) {
        character.tiles.push(type + t);
      }
    }
  },

  generateNpcs: function () {
    if (Dice.roll(1, 10) == 1) {
      var xy = this.npcGenerators[Dice.roll(1, this.npcGenerators.length) - 1];
      var x = xy[0];
      var y = xy[1];
      if (typeof (this.gameboard.unionMatrix[y][x]) == 'string') {
        this.generateNpc(x, y);
      }
    }
  },

  generatePlayer: function () {
    this.player = this.createCharacter('player', 60, 20);
    player = this.player;
    player.hp = 200;
    player.die = function () {
      player.tiles = ['corpse'];
      game.flashCount = 666; // hack because of crappy flash algorithm
      game.enabled = false;
      game.textConsole.print("Player DIES!");
    };
    this.player.tiles = ['paladin1', 'paladin2'];
  },

  generateWhirlpool: function () {
    whirlpool = this.createCharacter('whirlpool', 24, 35);
    whirlpool.tiles = ['whirlpool1', 'whirlpool2'];
    whirlpool.swims = true;
    whirlpool.walks = false;
  },

  registerNpcGenerators: function () {
    this.npcGenerators = [];
    for (r = 0; r < this.gameboard.tileMatrix.length; r++) {
      for (c = 0; c < this.gameboard.tileMatrix.length; c++) {
        switch (this.gameboard.tileMatrix[r][c]) {
          case 'dungeon': this.npcGenerators.push([c, r]); break;
          case 'deepwater': if (Dice.roll(1, 10) == 1) { this.npcGenerators.push([c, r]) } break;
        }
      }
    }
  },

  renderStatus: function () {
    if (this.player.hp > 0) {
      var statusMessage = "Player Health: " + this.player.hp.toString();
    } else {
      var statusMessage = "YOU ARE DEAD - GAME OVER";
      this.gameboard.unionMatrix[this.player.y][this.player.x] = 'corpse';
      this.gameboard.tileMatrix[this.player.y][this.player.x] = 'corpse';
    }
    $('header').innerHTML = "<h1><a href=\"http://usergenic.com/\">Brendan's</a> ULTIMAte DHTML Demo</h1><h2>" + statusMessage + "</h2>";
  },

  start: function () {
    this.enabled = true;
    this.queuedCommand = null;
    this.characters = [];
    this.fluidClicks = 0;
    this.flashCount = 0;
    this.generatePlayer();
    this.renderStatus();
    this.generateWhirlpool();
    this.registerNpcGenerators();
    this.bindKeyboardEvents();
    this.activeRender();
    this.textConsole.print("Welcome to Brendan's DHTML Demo, version 0.Alpha");
    this.textConsole.print("You might need to click inside this page for the");
    this.textConsole.print("scripts to pick up on key-presses.  Use your arrow");
    this.textConsole.print("keys to move.  Use the 'A' key, followed by arrow for attack.");
  },

  render: function () {
    if (this.player && this.player.dead) this.gameboard.unionMatrix[this.player.y][this.player.x] = 'corpse';
    this.gameboard.render(this.player.x - 10, this.player.y - 6, 21, 13);
  },

  move: function (direction) {
    switch (direction) {
      case 'up': this.player.move(0, -1); break;
      case 'down': this.player.move(0, 1); break;
      case 'left': this.player.move(-1, 0); break;
      case 'right': this.player.move(1, 0); break;
    }
    this.turn();
    this.render();
  },

  playerCommand: function (command) {
    if (this.enabled) {
      switch (this.commandPrefix) {
        case 'attack': this.commandPrefix = null;
          switch (command) {
            case 'up': this.player.attack(0, -1); break;
            case 'down': this.player.attack(0, 1); break;
            case 'left': this.player.attack(-1, 0); break;
            case 'right': this.player.attack(1, 0); break;
            default:
              this.textConsole.print('Nothing');
          }
          this.turn();
          break;
        default: this.commandPrefix = null;
          switch (command) {
            case 'pass': this.commandPrefix = null;
              this.textConsole.print('Pass...');
              this.turn();
              break;
            case 'attack': this.commandPrefix = 'attack';
              this.textConsole.print('Attack - Direction?');
              break;
            case 'up': this.textConsole.print('North');
              this.move('up');
              break;
            case 'down': this.textConsole.print('South');
              this.move('down');
              break;
            case 'left': this.textConsole.print('West');
              this.move('left');
              break;
            case 'right': this.textConsole.print('East');
              this.move('right');
              break;
          }
      }
    }
    else {
      this.queuedCommand = command;
    }
  },

  turn: function () {
    this.gameboard.unionMatrix[player.y][player.x] = this.player;
    for (var c = 0; c < this.characters.length; c++) {
      var character = this.characters[c];
      if (character.type != 'player') {
        character[character.mood + 'Action']();
      }
    }
    this.generateNpcs();
    this.bringOutYourDead();
    this.renderStatus();
  }

};

var game = new Game('gameboards/world.txt?13');
