Object.extend(Event, {
  keyCode: function(event){
    return event.charCode || event.keyCode || event.which;
  }
});

var Keyboard = {
  bind: function(element){
    Event.observe(element,'keydown',this.keyDown,false);
    Event.observe(element,'keyup',this.keyUp,false);
    Event.observe(element,'blur',this.resetState,false);
    Event.observe(element,'focus',this.resetState,false);
  },
  observe: function(type,keyName,callback){
    if(typeof(this.observers[type][keyName])=='undefined'){
      this.observers[type][keyName]=$A([callback]);
    }
    else{
      this.observers[type][keyName].push(callback);
    }
  },
  resetState: function(){
    Keyboard.state = $H({});
  },
  keyUp: function(event){
    var keyCode = Event.keyCode(event);
    var keyName = Keyboard.keyCodeMap[keyCode];
    if(typeof(keyName)!='undefined'){
      Keyboard.setState(keyName,false);
    }
    if(typeof(Keyboard.observers.keyup[keyName])!='undefined'){
      Keyboard.observers.keyup[keyName].each(function(callback){
        callback(keyName)
      });
    }
  },
  keyDown: function(event){
    var keyCode = Event.keyCode(event);
    var keyName = Keyboard.keyCodeMap[keyCode];
    if(typeof(keyName)!='undefined'){
      Keyboard.setState(keyName,true);
    }
    if(typeof(Keyboard.observers.keydown[keyName])!='undefined'){
      Keyboard.observers.keydown[keyName].each(function(callback){
        callback(keyName)
      });
    }
  },
  getState: function(key){
    key_state = Keyboard.state[key];
    if(typeof(key_state)=='undefined') return false;
    return key_state;
  },
  setState: function(key,state){
    Keyboard.state[key]=state;
  },
  state: {},
  observers: {keyup:$A(),keydown:$A()},
  keyCodeMap: {
    38    : 'up',           27    : 'escape',
    63232 : 'up',           8     : 'backspace',
    40    : 'down',         9     : 'tab',
    63233 : 'down',         13    : 'return',
    37    : 'left',         27    : 'escape',
    63234 : 'left',         32    : 'space',
    39    : 'right',        46    : 'delete',
    63235 : 'right',       
    
    65    : 'a',            97    : 'a',
    66    : 'b',            98    : 'b',
    67    : 'c',            99    : 'c',
    68    : 'd',            100   : 'd',
    69    : 'e',            101   : 'e',
    70    : 'f',            102   : 'f',
    71    : 'g',            103   : 'g',
    72    : 'h',            104   : 'h',
    73    : 'i',            105   : 'i',
    74    : 'j',            106   : 'j',
    75    : 'k',            107   : 'k',
    76    : 'l',            108   : 'l',
    77    : 'm',            109   : 'm',
    78    : 'n',            110   : 'n',
    79    : 'o',            111   : 'o',
    80    : 'p',            112   : 'p',
    81    : 'q',            113   : 'q',
    82    : 'r',            114   : 'r',
    83    : 's',            115   : 's',
    84    : 't',            116   : 't',
    85    : 'u',            117   : 'u',
    86    : 'v',            118   : 'v',
    87    : 'w',            119   : 'w',
    88    : 'x',            120   : 'x',
    89    : 'y',            121   : 'y',
    90    : 'z',            122   : 'z'
  }
};

