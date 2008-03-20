var TileDefinitions = [
  ['deepwater' , 'water'     , 'shallowwater' , 'swamp'      , 'grass'     , 'trees'     , 'bigtrees'    , 'hills'      , 'mountains'  , 'dungeon'     , 'town'        , 'keep'        , 'village'    , 'castleleft' , 'castlemiddle' , 'castleright' ],
  ['shipwest'  , 'shipnorth' , 'shipeast'     , 'shipsouth'  , 'horsewest' , 'horseeast' , 'cobblestone' , 'bridge'     , 'balloon'    , 'bridgenorth' , 'bridgesouth' , 'ladderup'    , 'ladderdown' , 'ruins'      , 'shrine'       , 'player'      ],
  ['mage1'     , 'mage2'     , 'rogue1'       , 'rogue2'     , 'fighter1'  , 'fighter2'  , 'druid1'      , 'druid2'     , 'tinker1'    , 'tinker2'     , 'paladin1'    , 'paladin2'    , 'ranger1'    , 'ranger2'    , 'shepherd1'    , 'shepherd2'   ],
  ['column'    , 'wwne'      , 'wwnw'         , 'wwse'       , 'wwsw'      , 'mast'      , 'wheel'       , 'rocks'      , 'corpse'     , 'rockwall'    , 'sword'       , 'sword2'      , 'chest'      , 'ankh'       , 'floor'        , 'woodfloor'   ],
  ['moongate1' , 'moongate2' , 'moongate3'    , 'moongate4'  , 'greenforce', 'blueforce' , 'redforce'    , 'purpleforce', 'wall'       , 'secretdoor'  , 'altar'       , 'spit'        , 'lava'       , 'attack'     , 'magicattack'  , 'hit'         ],
  ['guard1'    , 'guard2'    , 'citizen1'     , 'citizen2'   , 'bard1'     , 'bard2'     , 'jester1'     , 'jester2'    , 'beggar1'    , 'beggar2'     , 'child1'      , 'child2'      , 'bull1'      , 'bull2'      , 'cleric1'      , 'cleric2'     ],
  ['lettera'   , 'letterb'   , 'letterc'      , 'letterd'    , 'lettere'   , 'letterf'   , 'letterg'     , 'letterh'    , 'letteri'    , 'letterj'     , 'letterk'     , 'letterl'     , 'letterm'    , 'lettern'    , 'lettero'      , 'letterp'     ],
  ['letterq'   , 'letterr'   , 'letters'      , 'lettert'    , 'letteru'   , 'letterv'   , 'letterw'     , 'letterx'    , 'lettery'    , 'letterz'     , 'counterspace', 'counterright', 'counterleft', 'counter'    , 'darkness'     , 'stonewall'   ],
  ['pshipwest' , 'pshipnorth', 'pshipeast'    , 'pshipsouth' , 'nixie1'    , 'nixie2'    , 'squid1'      , 'squid2'     , 'seaserpent1', 'seaserpent2' , 'seahorse1'   , 'seahorse2'   , 'whirlpool1' , 'whirlpool2' , 'tornado1'     , 'tornado2'    ],
  ['rat1'      , 'rat2'      , 'rat3'         , 'rat4'       , 'bat1'      , 'bat2'      , 'bat3'        , 'bat4'       , 'spider1'    , 'spider2'     , 'spider3'     , 'spider4'     , 'ghost1'     , 'ghost2'     , 'ghost3'       , 'ghost4'      ],
  ['slime1'    , 'slime2'    , 'slime3'       , 'slime4'     , 'troll1'    , 'troll2'    , 'troll3'      , 'troll4'     , 'gremlin1'   , 'gremlin2'    , 'gremlin3'    , 'gremlin4'    , 'mimic1'     , 'mimic2'     , 'mimic3'       , 'mimic4'      ],
  ['reaper1'   , 'reaper2'   , 'reaper3'      , 'reaper4'    , 'insects1'  , 'insects2'  , 'insects3'    , 'insects4'   , 'beholder1'  , 'beholder2'   , 'beholder3'   , 'beholder4'   , 'phantom1'   , 'phantom2'   , 'phantom3'     , 'phantom4'    ],
  ['orc1'      , 'orc2'      , 'orc3'         , 'orc4'       , 'skeleton1' , 'skeleton2' , 'skeleton3'   , 'skeleton4'  , 'pirate1'    , 'pirate2'     , 'pirate3'     , 'pirate4'     , 'snake1'     , 'snake2'     , 'snake3'       , 'snake4'      ],
  ['ettin1'    , 'ettin2'    , 'ettin3'       , 'ettin4'     , 'headless1' , 'headless2' , 'headless3'   , 'headless4'  , 'ogre1'      , 'ogre2'       , 'ogre3'       , 'ogre4'       , 'wisp1'      , 'wisp2'      , 'wisp3'        , 'wisp4'       ],
  ['wizard1'   , 'wizard2'   , 'wizard3'      , 'wizard4'    , 'lich1'     , 'lich2'     , 'lich3'       , 'lich4'      , 'salamander1', 'salamander2' , 'salamander3' , 'salamander4' , 'zorn1'      , 'zorn2'      , 'zorn3'        , 'zorn4'       ],
  ['balrog1'   , 'balrog2'   , 'balrog3'      , 'balrog4'    , 'hydra1'    , 'hydra2'    , 'hydra3'      , 'hydra4'     , 'dragon1'    , 'dragon2'     , 'dragon3'     , 'dragon4'     , 'gargoyle1'  , 'gargoyle2'  , 'gargoyle3'    , 'gargoyle4'   ]
];

var SpriteData = {
  tile: {
    className   : 'tile',
    defaultTile : 'grass',
    tileMap     : []
  }
};

// using an anonymous function, to leave no trace while we do a little
// processing of our sprite table.
(function(){
  for(var r=0;r<TileDefinitions.length;r++){
    var row=TileDefinitions[r];
    for(var c=0;c<row.length;c++){
      SpriteData.tile.tileMap[row[c]] = {
        x: 0,
        y: 0,
        left:  (32*c), 
        top:   (32*r), 
        width:  32, 
        height: 32
      };
    }
  }

  for(var f=0;f<32;f++){
    SpriteData.tile.tileMap['deepwater'+f] = {
      x: 0,
      y: 0,
      left: 16*32,
      top:  f+0,
      width: 32,
      height:32
    };
  }
  for(var f=0;f<32;f++){
    SpriteData.tile.tileMap['water'+f] = {
      x: 0,
      y: 0,
      left: 16*32,
      top:  f+64,
      width: 32,
      height:32
    };
  }
  for(var f=0;f<32;f++){
    SpriteData.tile.tileMap['shallowwater'+f] = {
      x: 0,
      y: 0,
      left: 16*32,
      top:  f+128,
      width: 32,
      height:32
    };
  }
  for(var f=0;f<32;f++){
    SpriteData.tile.tileMap['lava'+f] = {
      x: 0,
      y: 0,
      left: 16*32,
      top:  f+192,
      width: 32,
      height:32
    };
  }
})();


