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
  aggressiveAction: function() {
    this.attackOrPursue(this.gameboard.game.player);
  },
  attack: function(xOffset, yOffset) {
    y=this.y+yOffset;
    x=this.x+xOffset
    var target=this.gameboard.unionMatrix[y][x];
    if(typeof(target)=='object' && target != null) {
      switch(Dice.roll(1,2)) {
        case 1:  this.gameboard.game.textConsole.print(this.type.capitalize() +' hit '+target.type+'!!!');
                 target.hurt(Dice.roll(1,10));
                 this.gameboard.flash('hit',x,y);
                 break;
        default: this.gameboard.flash('attack',x,y);
                 this.gameboard.game.textConsole.print(this.type.capitalize() +' missed '+target.type+'.');
      }
    }
    else {
      this.gameboard.game.textConsole.print('Nothing to attack there.');
    }
  },
  attackOrPursue: function(target) {
    // attack if in range
    if(Math.abs(this.x-target.x)<=1 && Math.abs(this.y-target.y)<=1) {
      this.attack(target.x-this.x, target.y-this.y);
    }
    else { // pursue otherwise
      var xOffset = target.x-this.x;
      var yOffset = target.y-this.y;
      if(xOffset < -1) xOffset = -1;
      if(xOffset >  1) xOffset =  1;
      if(yOffset < -1) yOffset = -1;
      if(yOffset >  1) yOffset =  1;
      if(this.okayMove(xOffset,yOffset)) 
        return this.move(xOffset, yOffset);
      if(xOffset == 0 && yOffset != 0 && this.okayMove(0, yOffset)) 
        return this.move(0, yOffset);
      if(yOffset == 0 && xOffset != 0 && this.okayMove(xOffset, 0)) 
        return this.move(xOffset, 0);
      if(this.okayMove(0, yOffset)) 
        return this.move(0, yOffset);
      return this.move(xOffset, 0);
    }
  },
  die: function() {
    this.dead=true;
    this.gameboard.game.textConsole.print(this.type.capitalize() + ' dies.');
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

