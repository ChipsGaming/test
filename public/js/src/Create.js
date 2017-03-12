define(function(require){
  var createStars = require('game/CreateStar');


  function starDeath(game, star) {
      star.kill();
      game.lives--;
      var bomb=bombs.getFirstExists(false);
      bomb.reset(star.x,star.y);
      bomb.play('boom',30,false,true);
      if (game.lives<0) {
          game.isOver=true;
  
          _scope = game.add.text(430,320, "КОНЕЦ", {
              font: "70px Arial",
              fill: "#000"
          });
      } else {
          return createStars(game);
      }
  }

  return function(game){
    game.lives=3;
    game.liveTime=3;
    game.isOver=false;
    game.scope=0;

    //Для использования физики игры подключаем систему Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);    

    //Добавляем спрайты
    game.add.sprite(0,0,'background');

    bombs=game.add.group();
    var bomb=bombs.create(0,0,'boom',[0], false);
    bomb.anchor.setTo(0.5, 0.5);
    bomb.animations.add('boom');

    game.star = createStars(game);
    //Создадим группу объектов платформ, на которые можно будет запрыгивать
    platforms=game.add.group();

    //Включить физику для всех объектов в этой группе
    platforms.enableBody=true;

    //Создадим основную платформу "земля"  
    var ground = platforms.create(0,game.world.height-110,'ground');    

    //Увеличим в размере
    ground.scale.setTo(2,0.2);

    //Укажем, что объект неподвижный
    ground.body.immovable=true;

    var ledge=platforms.create(400,400,'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150,250,'ground');

    ledge.body.immovable=true;

    // Добавляю объект игрока

    player = game.add.sprite(32, game.world.height-200,'dude');

    //Для созданного спрайта включаем физику
    game.physics.arcade.enable(player);
    //Эффект батута
    player.body.bounce.y=0.2;
    //Задаем гравитацию для объекта
    player.body.gravity.y=1000;

    player.body.collideWorldBounds =true;

    //Используем две анимации, т.е. смена фреймов со скоростью 10 ф/с
    //последний параметр true указывает на цикличность
    player.animations.add('left',[0,1,2,3],10,true);
    player.animations.add('right',[5,6,7,8],10,true);    

    //Настройка управления персонажем
    cursors=game.input.keyboard.createCursorKeys();

    player.body.velocity.x=0;

    _scope = game.add.text(10, 10, "Счет: 0", {
        font: "14px Arial",
        fill: "#000"
    });

    game.time.events.loop(Phaser.Timer.SECOND, function(){
      if(!game.isOver){
        game.liveTime--;
        if(game.liveTime < 0){
          game.star = starDeath(game, game.star);
        }
      }   
    }, this);
  };
});
