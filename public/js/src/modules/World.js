if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function (require) {

    function World (step) {
        this.players={};
        this.step=step;
    }

    //Выполняет команду игрока в симуляторе
    World.prototype.doAction=function(data) {
        var id = data.id;
        var player=this.players[id];
        if (player!=undefined) {
            player.x+=data.left.isDown?-1*this.step:0;
            player.x+=data.right.isDown?this.step:0;
            player.y+=data.down.isDown?this.step:0;
            player.y+=data.up.isDown?-1*this.step:0;
        }
        return {x:player.x, y:player.y, cmdId:data.cmdId, remote:player.remote};
    }

    //Создает игрока
    World.prototype.respawnPlayer=function (id, remote) {
            this.players[id]={id:id, remote:remote, x:0, y:0};
            return this.players[id];
    }

    //УДаляет игрока
    World.prototype.killPlayer=function (id) {
        delete this.players[id];    
        for (var c in this.players) {
            var remote = this.players[c].remote;
            remote.kill(id);
        }
    }

    //Синхронизация всех состояний
    World.prototype.syncAllStates=function  () {
        for (var id in this.players) {
            var player=this.players[id];
            var remote=player.remote;            
            for (var subId in this.players) {
                if (id!=player.id) {
                    var state={}; 
                    var el=this.players[subId]
                    state.x=el.x;
                    state.y=el.y;
                    remote.update(subId,state);  
                }              
            }
        }
    }

    //Директивно задать состояние для объекта
    World.prototype.setPlayerState=function(id,state) {
        var player=this.players[id];
        if (player==undefined) {
            this.respawnPlayer(id, null);
            player=this.createSprite(id);
        }
        player.sprite.x=state.x;
        player.sprite.y=state.y;
        player.x=state.x;
        player.y=state.y; 
    }

    World.prototype.getStates=function() {
        return this.players;
    }

    return World;    
});