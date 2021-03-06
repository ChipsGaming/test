define ( function (require) {
    Phaser=require('Phaser');
    World = require('modules/World');
    UnitState=require('modules/UnitState');
    Queue= require('modules/Queue');

    var staticSettings=require('modules/StaticSettings');   

    var cmdQueue=new Queue();

    //var players={};
    var client = new Eureca.Client();
    var myId="NON";
    var serverProxy;
    var cursors;
    var cmdId=0;
    var allId={};

    var lastId=-1;

    game = new Phaser.Game (800,600, Phaser.AUTO, '', {
            preload: preload,
            create: create,
            update: update
        }); 
    
     world=new World(staticSettings.step,game);

    //-------Proxy

    client.ready(function(proxy) {  
        serverProxy=proxy;
    });

    client.exports.connect=function (id) {
        myId=id;        
        world.createSprite(myId);
    }

    client.exports.kill=function (id) {
        world.killPlayer(id); 
    }

    client.exports.update=function (id,state) {
        if (id!=myId) {
            world.setPlayerState(id,state);
        }
    }

    client.exports.sendResult=function (state) {
        while (cmdQueue.has()) {
            var cmd=cmdQueue.shift();
            if (state.cmdId>=lastId) {
                lastId=state.cmdId;                    
                if (cmd.data.cmdId<state.cmdId) continue;
                if (cmd.data.cmdId==state.cmdId) {
                    if (cmd.state.equal(state)) break;
                    console.log('old_state:',cmd.state);
                    console.log('new_state:',state);
                    world.setPlayerState(myId,state);
                }
                world.doAction(cmd.data);
            }
        }
    }

    function preload(game) {
        game.load.image('background','img/background.png');
        game.load.image('star','img/star.png');
    }

    function create(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0,0,'background');
        cursors=game.input.keyboard.createCursorKeys();
    }

    function update(game) {            
            var data=new UnitState(myId,0,0);
            if (cursors.left.isDown) data.addCommand('left'); 
            if (cursors.right.isDown) data.addCommand('right'); 
            if (cursors.up.isDown) data.addCommand('up');
            if (cursors.down.isDown) data.addCommand('down');

            if (data.isModifiable()) { 
                var tId=cmdId++;                
                if (allId[tId]==undefined) {
                    allId[tId]= true;  
                    data.cmdId=tId;  
                    serverProxy.changeState(data);
                    data.lastState={x:data.x, y:data.y, cmd:data.keys.length};
                    var cmd={data:data, state:world.doAction(data)};
                    
                    cmdQueue.push(cmd);
                    world.setPlayerState(myId,cmd.state);
                }
            }
    }
    
});