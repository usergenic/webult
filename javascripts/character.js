var Character = Class.create();
Character.prototype = {
  initialize: function() {
    this.type='citizen';
    this.tiles=['citizen1','citizen2'];
    this.mood='passive';
    this.x=null; // x map coordinate
    this.y=null; // y map coordinate
    this.hp=10; // hitpoints
    this.dead=false;
    this.walks=true;
    this.swims=false;
    this.flies=false;
  },
  attack: function(xOffset, yOffset) {
    y=this.y+yOffset;
    x=this.x+xOffset
    var target=this.gameboard.unionMatrix[y][x];
    if(typeof(target)=='object' && target != null) {
      switch(Dice.roll(1,3)) {
        case 1:  this.gameboard.game.textConsole.print(target.type+' hit!!!');
                 this.gameboard.flash('hit',x,y);
                 target.hurt(Dice.roll(1,10));
                 break;
        default: this.gameboard.flash('attack',x,y);
                 this.gameboard.game.textConsole.print(target.type+' missed.');
      }
    }
    else {
      this.gameboard.game.textConsole.print('Nothing to attack there.');
    }
  },
  die: function() {
    var characters=this.gameboard.game.characters;
    this.dead=true;
    for(c=0;c<characters.length;c++) {
      if(characters[c].dead) {
        characters.splice(c);
        c--;
      }
    }
    this.gameboard.unionMatrix[this.y][this.x]=
      this.gameboard.tileMatrix[this.y][this.x];
    this.gameboard.game.textConsole.print(this.type + ' dies.');
  },
  hurt: function(damage) {
    this.hp = this.hp - damage;
    if(this.hp < 1) {
      this.die();
    }
  },
  move: function(xOffset, yOffset) {
    if(this.okayMove(xOffset, yOffset)) {
      this.place(this.x+xOffset, this.y+yOffset);
    }
  },
  okayMove: function(xOffset, yOffset) {
    // the following is expensive because tileRegion needs to iterate through
    // characters.  we need to cache character locations on a cached layered
    // tileMatrix to enable massive numbers of characters to interact without
    // an unnecessary n-squared performance hit.
    var tile = this.gameboard.unionMatrix[this.y+yOffset][this.x+xOffset];
    switch(tile) {
      case 'purpleforce': return false;
      
      case 'deepwater':
      case 'water':
      case 'shallowwater': return (this.swims || this.flies);
      
      case 'bridge': return (this.swims || this.flies || this.walks);
      
      case 'hills':
      case 'bridge':
      case 'cobblestone':
      case 'floor':
      case 'woodfloor':
      case 'grass':
      case 'bigtrees':
      case 'trees': return (this.walks || this.flies);

      default: return false;
    }
  },
  passiveAction: function() {
    switch(Dice.roll(1,16)) {
      case 1: this.move(0,-1); break;
      case 2: this.move(-1,0); break;
      case 3: this.move(1,0 ); break;
      case 4: this.move(0,1 ); break;
    }
  },
  place: function(x, y) {
    moi=this.gameboard.unionMatrix[this.y][this.x];
    this.gameboard.unionMatrix[this.y][this.x]=this.gameboard.tileMatrix[this.y][this.x];
    this.x=x;
    this.y=y;
    this.gameboard.unionMatrix[this.y][this.x]=moi;
  },
  talk: function() {
    return 'hmmm.';
  }
};

