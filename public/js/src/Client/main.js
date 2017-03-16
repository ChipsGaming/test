define ( function (require) {
    var Phaser=require('Phaser');
    var World = require('modules/World');   

    world=new World();

    //var players={};
    var client = new Eureca.Client();
    var myId="";
    var serverProxy;
    var cursors;
    var cmdPos=0;
    var cmds=[];

    game = new Phaser.Game (800,600, Phaser.AUTO, '', {
            preload: preload,
            create: create,
            update: update
        });
    
    World.prototype.createSprite=function(id) {
        var player=this.players[id];
        var unit=game.add.sprite(0,0,'star');
        game.physics.arcade.enable(unit);
        player.sprite=unit;
        return player;
    }

    //-------Proxy

    client.ready(function(proxy) {  
        serverProxy=proxy;
    });

    client.exports.connect=function (id) {
        myId=id;
    }

    client.exports.kill=function (id) {

        world.killPlayer(id); 
        /*if (players[id]!=undefined) {
            players[id].kill();
            delete players[id]; 
            console.log('kill player ',id);
        }    */
    }

    client.exports.update=world.updateState;/*function (id,state) {  
        //console.log(' update: ',state);

        world.updateState(id,state)

        if (players[id]==undefined) addPlayer(id);

        if (id!=myId) {
            var player=players[id];
            if(player!=undefined) {
                player.x=state.x;
                player.y=state.y;
            }
        }

    }*/

    client.exports.sendResult=function (state) {
        world.setPlayerState(myId,state);
        /*var player=players[myId];
        player.x=state.x;
        player.y=state.y;*/
        //console.log(state);
    }

    //--------

    function preload(game) {
        game.load.image('background','img/background.png');
        game.load.image('star','img/star.png');
    }

    function create(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0,0,'background');
        /*var player=game.add.sprite(0,0,'star');  
        players[myId]=player;*/
        cursors=game.input.keyboard.createCursorKeys();
    }

    function update(game) {
            var data={left:{}, right:{}, up:{}, down:{}};
            data.id=myId;
            data.left.isDown=cursors.left.isDown;
            data.right.isDown=cursors.right.isDown;
            data.up.isDown=cursors.up.isDown;
            data.down.isDown=cursors.down.isDown;
            data.cmdId=cmdPos;
            if (data.left.isDown||data.right.isDown||data.up.isDown||data.down.isDown) {
                    cmds[cmdPos]=data;
                    cmdPos++;
                    serverProxy.changeState(data);
            }
    }
    
});