var Gameboard = Class.create();
Gameboard.prototype = {

  // initialize the gameboard, loading the source.
  initialize: function(game, source) {
    this.loadSource(source);
    this.gameboardFrame = new GameboardFrame($('gameboard'), 21, 13);
    this.game = game;
  },
  
  // four loops here because we need to cascade the darkness outwards from
  // the four cardinal directions.
  applyPerspectiveOcclusion: function(region, px, py) {
    for(x=px;x>=0;x--) {
      for(y=py;y>=0;y--) {
        if((x-px).abs() > 1 || (y-py).abs() > 1) {
          if(this.checkOcclusion(region[y==py ? y : y+1][x==px ? x : x+1])) region[y][x]='darkness';
        }
      }
      for(y=py;y<region.length;y++) {
        if((x-px).abs() > 1 || (y-py).abs() > 1) {
          if(this.checkOcclusion(region[y==py ? y : y-1][x==px ? x : x+1])) region[y][x]='darkness';
        }
      }
    }
    for(x=px;x<region[0].length;x++) {
      for(y=py;y>=0;y--) {
        if((x-px).abs() > 1 || (y-py).abs() > 1) {
          if(this.checkOcclusion(region[y==py ? y : y+1][x==px ? x : x-1])) region[y][x]='darkness';
        }
      }
      for(y=py;y<region.length;y++) {
        if((x-px).abs() > 1 || (y-py).abs() > 1) {
          if(this.checkOcclusion(region[y==py ? y : y-1][x==px ? x : x-1])) region[y][x]='darkness';
        }
      }
    }
  },
  
  // tells you if a tile occludes tiles behind it, from the perspective of
  // a non-flying character.
  checkOcclusion: function(tile) {
    switch(tile) {
      case 'bigtrees':
      case 'wall':
      case 'stonewall':
      case 'mountains':
      case 'darkness' : return true
      default:          return false
    }
  },
  
  // temporarily displays a different sprite at the x,y
  flash: function(tile, x, y) {
    var matrix = this.unionMatrix;
    var oldTile = matrix[y][x];
    var game = this.game;
    game.enabled=false;
    game.flashCount++;
    setTimeout(function(){
      matrix[y][x]=tile;
      game.render();
      setTimeout(function(){
        matrix[y][x]=oldTile;
        game.render();
        game.flashCount--;
        if(game.flashCount<1) game.enabled=true;
        if(game.queuedCommand) {
          var command = game.queuedCommand;
          game.queuedCommand = null;
          game.playerCommand(command);
        }
      }, 100);
    }, 1);
  },
  
  // given gameboard source content, load the tiles according
  // to the legend.
  loadSource: function(source) {
    source = source.split(/^\s*legend\s*\n/mi);
    var legendRows = source[1];
    var legendRows = legendRows.split(/\n/m);
    var legend = {}
    for(var k=0;k<legendRows.length;k++) {
      var legendRow = legendRows[k];
      legend[legendRow[0]] = legendRow.slice(2);
    }
    source = source[0];
    this.tileMatrix = [];
    this.unionMatrix = [];
    var lines = source.split(/\n/);
    for(var l=0;l<lines.length;l++) {
      var line = lines[l];
      var tileLine = [];
      var unionLine = [];
      for(c=0; c<line.length; c++) {
        tileLine.push(legend[line[c]]);
        unionLine.push(legend[line[c]]);
      }
      this.tileMatrix.push(tileLine);
      this.unionMatrix.push(unionLine);
    }
  },

  // renders a rectangular region of the gameboard into the gameboard element.
  render: function(left, top, width, height) {
    var region=this.tileRegion(this.unionMatrix, left, top, width, height);
    this.applyPerspectiveOcclusion(region, 10, 6);
    this.gameboardFrame.drawRegion(region);
  },

  // returns a rectangle containing a subsection of the tile 
  // matrix, useful for rendering.
  tileRegion: function(matrix, left, top, width, height) {
    var region=[];
    for(r=0;r<height;r++) {
      var row=matrix[top+r];
      var segment=[];
      for(c=0;c<width;c++) {
        segment.push(row[c+left]);
      }
      region.push(segment);
    }
    return region;
  }
  
};

var GameboardFrame = Class.create();
GameboardFrame.prototype = {
  
  // for more complicated animations, we might choose to use a page-flipping
  // technique.  abstracting displays to frames enables chunking the
  // hide/show of a batch of rendered sprites all in one go.
  initialize: function(element, width, height) {
    this.element=element;
    this.sprites=[];
    for(var y=0;y<height;y++) {
      var spriteRow=[];
      for(var x=0;x<width;x++) {
        var spriteId = element.id.toString()+'_'+x.toString()+'_'+y.toString();
        var sprite=new Sprite(spriteId, SpriteData.tile);
        this.element.appendChild(sprite.element);
        sprite.show();
        sprite.setX(x*32);
        sprite.setY(y*32);
        spriteRow.push(sprite);
      }
      this.sprites.push(spriteRow);
    }
  },
  
  // tells a rectangle of sprites to flip their bitmap offsets according
  // to the spritedata definitions.
  drawRegion: function(region) {
    for(var r=0;r<region.length;r++) {
      var regionRow=region[r];
      var spriteRow=this.sprites[r];
      for(var c=0;c<regionRow.length;c++) {
        var sprite=spriteRow[c];
        var tile=regionRow[c];
        if(typeof(tile)=='object' && tile != null) {
          tile=tile.tiles[Dice.roll(1,tile.tiles.length)-1];
        }
        switch(tile) {
          case 'water':
          case 'deepwater':
          case 'shallowwater':
          case 'lava':
            tile=tile+game.fluidClicks.toString();
        }
        sprite.selectTile(tile);
      }
    }
  }

};

