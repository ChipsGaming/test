var scope=0;
var lives=3;
var liveTime=3;
var isOver=false;

var game=new Phaser.Game (800,600, Phaser.AUTO, '', {preload: preload, create:create, update:update});
function preload() {
    game.load.image('background','img/background.png');
    game.load.image('ground','img/platform.png');
    game.load.image('star','img/star.png');
    game.load.spritesheet('dude','img/dude.png',32,48);
    game.load.spritesheet('boom','img/explosion.png',64,64,23);
}

function create() {
    //Для использования физики игры подключаем систему Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);    

    //Добавляем спрайты
    game.add.sprite(0,0,'background');

    bombs=game.add.group();
    var bomb=bombs.create(0,0,'boom',[0], false);
    bomb.anchor.setTo(0.5, 0.5);
    bomb.animations.add('boom');

    createStars();
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

    //*****Добавляю объект игрока

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


    game.time.events.loop(Phaser.Timer.SECOND, starLiveTimer, this);

}

function update () {
    if (!isOver) {
        //Добавим проверку на столкновения
        var hitPlatform = game.physics.arcade.collide(player,platforms);
        game.physics.arcade.collide(star, platforms);
        game.physics.arcade.collide(player,star,collectStar,null,this);
        
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

        /* Дополнительные операции */

        _scope.setText("Счет: "+scope+"\nЖизней: "+lives);
    }
}

function collectStar(player,star) {
    star.kill();
    scope++;
    createStars();
}

function createStars() {
    liveTime=4;
    var newPos=Math.random()*(game.world.width-32);
    star = game.add.sprite(newPos<5?5:newPos,0,'star');
    game.physics.arcade.enable(star);
    star.body.gravity.y = 800;
    star.body.bounce.y=0.3+Math.random()*0.2;  
}

function starLiveTimer() {
    if (!isOver) {
        liveTime--;
        if (liveTime<0) starDeath();
    }   
}

function starDeath() {
    star.kill();
    lives--;
    var bomb=bombs.getFirstExists(false);
    bomb.reset(star.x,star.y);
    bomb.play('boom',30,false,true);
    if (lives<0) {
        isOver=true;

        _scope = game.add.text(430,320, "КОНЕЦ", {
            font: "70px Arial",
            fill: "#000"
        });
    } else {
        createStars();
    }
}