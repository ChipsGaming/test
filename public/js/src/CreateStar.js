define(function(require){
  return function(game){
    game.liveTime=4;
    var newPos=Math.random()*(game.world.width-32);
    var star = game.add.sprite(newPos<5?5:newPos,0,'star');
    game.physics.arcade.enable(star);
    star.body.gravity.y = 800;
    star.body.bounce.y=0.3+Math.random()*0.2;  

    return star;
  };
});
