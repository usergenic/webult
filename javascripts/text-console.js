var TextConsole = Class.create();
TextConsole.prototype = {
  initialize: function(element) {
    this.element = element;
  },
  print: function(line) {
    var lines = this.element.innerHTML.split(/\n/);
    if(lines.length > 3){lines.shift()}
    lines.push(line);
    this.element.innerHTML=lines.join('\n');
  }
};