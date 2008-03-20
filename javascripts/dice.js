var Dice = Class.create();
Object.extend(Dice, {
  roll: function(count, sides) {
    var total=0;
    for(var d=0;d<count;d++) {
      total = total + (Math.random() * sides).floor() + 1;
    }
    return total;
  }
});
Dice.prototype = {
  initialize: function(count, sides) {
    this.count = count;
    this.sides = sides;
  },
  roll: function() {
    return Dice.roll(this.count, this.sides);
  }
};
