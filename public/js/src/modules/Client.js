define ( function (require) {
    var Phaser=require('Phaser');
    var World = require('modules/World');
    var staticSettings=require('modules/StaticSettings');
    var UnitState=require('modules/UnitState');

    //var players={};
    var client = new Eureca.Client();
    var myId="";
    var serverProxy;
    var cursors;
    var cmdPos=0;
    var cmds={};

    game = new Phaser.Game (800,600, Phaser.AUTO, '', {
            preload: preload,
            create: create,
            update: update
        }); 
    
     world=new World(staticSettings.step.step,game);

    //-------Proxy

    client.ready(function(proxy) {  
        serverProxy=proxy;
    });

    client.exports.connect=function (id) {
        myId=id;
    }

    client.exports.kill=function (id) {
        world.killPlayer(id); 
    }

    client.exports.update=function (id,state) {
        world.setPlayerState(id,state);
    }

    client.exports.sendResult=function (state) {
        var localState=cmds[state.cmdId];
        if (localState!=undefined) {
            if (localState)
            world.setPlayerState(myId,state);
        }
    }

    //--------

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
            var data=new UnitState(myId,0,0,myId,undefined);
            if (cursors.left.isDown) data.addCommand('left'); 
            if (cursors.right.isDown) data.addCommand('right'); 
            if (cursors.up.isDown) data.addCommand('up');
            if (cursors.down.isDown) data.addCommand('down');

            if (data.isModifiable()) {
                data.cmdId=cmdPos;                
                cmdPos++;                    
                serverProxy.changeState(data);
                
                cmds[cmdPos]={};
                cmds[cmdPos].data=data;
                cmds[cmdPos].state=world.doAction(data);                            
            }
    }
    
});