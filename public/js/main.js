var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: function(){
    game.load.image('sky', '/public/img/sky.png');
    game.load.image('ground', '/public/img/platform.png');
    game.load.image('star', '/public/img/star.png');
    game.load.spritesheet('dude', '/public/img/dude.png', 32, 48);
  },
  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    /*player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);*/

    stars = game.add.group();
    stars.enableBody = true;
    for(var i = 0; i < 12; i++){
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  },
  update: function(){
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, function(player, star){
      star.kill();
    }, null, this);

    cursors = game.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    if(cursors.left.isDown){
      player.body.velocity.x = -150;
      player.animations.play('left');
    }
    else if(cursors.right.isDown){
      player.body.velocity.x = 150;
      player.animations.play('right');
    }
    else{
      player.animations.stop();
      player.frame = 4;
    }

    if(cursors.up.isDown){
      player.body.velocity.y = -150;
    }
    else if(cursors.down.isDown){
      player.body.velocity.y = 150;
    }
  }
});
