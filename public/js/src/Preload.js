define(function(require){
  return function(game){
    game.load.image('background','img/background.png');
    game.load.image('ground','img/platform.png');
    game.load.image('star','img/star.png');
    game.load.spritesheet('dude','img/dude.png',32,48);
    game.load.spritesheet('boom','img/explosion.png',64,64,23);
  };
});
