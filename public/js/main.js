var scope=0;

var game=new Phaser.Game (800,600, Phaser.AUTO, '', {preload: preload, create:create, update:update});
var player; var platforms; var cursors; var stars; var _scope;
function preload() {
    game.load.image('sky','img/background.png');
    game.load.image('ground','img/platform.png');
    game.load.image('star','img/star.png');
    //Загрузка спрайт листа
    game.load.spritesheet('dude','img/dude.png',32,48);
}

function create() {
    //Для использования физики игры подключаем систему Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);    

    //Добавляем спрайты
    game.add.sprite(0,0,'sky');
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
        fill: "#000",
        align: "center"
    });

}

function update () {
    //Добавим проверку на столкновения
    var hitPlatform = game.physics.arcade.collide(player,platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(player,stars,collectStar,null,this);
    _scope.setText("Счет: "+scope);
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

}

function collectStar(player,star) {
    star.kill();
    scope++;
    createStars();
}

function createStars() {
    stars=game.add.group();
    stars.enableBody=true;
    var star = stars.create(Math.random()*game.world.width,0,'star');
    star.body.gravity.y = 800;
    star.body.bounce.y=0.3+Math.random()*0.2;    
}