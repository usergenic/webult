var Sprite = Class.create();
Sprite.prototype = {
  noPx  : document.all ? 0 : "px",
  toPx  : function(value) { return value+this.noPx; },
  fromPx: function(value) { return parseInt(value); },
  
  selectTile: function(tileName){
    var tileData = this.spriteData.tileMap[tileName];
    if(typeof(tileData)=='undefined') return false;
    var styleObject = this.element.style;
    this.currentTile = tileName;
    this.xOffset = tileData.x;
    this.yOffset = tileData.y;
    styleObject.left = this.toPx(this.x-this.xOffset);
    styleObject.top = this.toPx(this.y-this.yOffset);
    styleObject.backgroundPosition = this.toPx(-tileData.left)+' '+this.toPx(-tileData.top);
    styleObject.width = this.toPx(tileData.width);
    styleObject.height = this.toPx(tileData.height);
  },
  initialize: function(elementId,spriteData){
    this.spriteData = spriteData;
    this.element = document.createElement('div');
    this.element.id = elementId;
    this.element.className = this.spriteData.className;
    this.xOffset = 0;
    this.yOffset = 0;
    this.x = 0;
    this.y = 0;
    var styleObject = this.element.style;
    styleObject.backgroundAttachment = 'scroll';
    styleObject.backgroundRepeat = 'no-repeat';
    styleObject.position = 'absolute';
    styleObject.visibility = 'hidden';
    this.selectTile(this.spriteData.defaultTile);
  },
  setX: function(x){
    this.x=x;
    this.element.style.left=this.toPx(this.x-this.xOffset);
  },
  setY: function(y){
    this.y=y;
    this.element.style.top=this.toPx(this.y-this.yOffset);
  },
  hide: function(){
    this.element.style.visibility='hidden';
  },
  show: function(){
    this.element.style.visibility='visible';
  }
};

