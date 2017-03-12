define(function(require){
    var Phaser = require('Phaser'),
    createStars = require('game/CreateStar');

return function (game) {
      if (!game.isOver) {
          //Добавим проверку на столкновения
          var hitPlatform = game.physics.arcade.collide(player,platforms);
          game.physics.arcade.collide(game.star, platforms);
          game.physics.arcade.collide(player,game.star,function(player,star){
            star.kill();
            game.scope++;
            game.star = createStars(game);
          },null,this);
  
          //Управление персонажем
          player.body.velocity.x=player.body.velocity.x/1.05;
          if (cursors.left.isDown) {
              player.body.velocity.x=-450;
              player.animations.play('left');
          } else if (cursors.right.isDown) {
              player.body.velocity.x=450;
              player.animations.play('right');
          } else {
              player.animations.stop();
              player.frame=4;
          }
  
          //Игрок может отпрыгивать от платформы
          if (cursors.up.isDown&&player.body.touching.down&&hitPlatform) {
              player.body.velocity.y=-600;
          }
  
          // Дополнительные операции
  
          _scope.setText("Счет: "+game.scope+"\nЖизней: "+game.lives);
      }
  }
});