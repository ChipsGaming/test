if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function(require){
    var queue=require('./Queue');
    var netCore=require('./NetCore');
    var staticSettings=require('./StaticSettings');

    World=require('./World');
    UnitState=require('./UnitState');
    
    var netServer=netCore.proxy;
    var server=netCore.server;
    var world=new World(staticSettings.step);

    const tickrate=staticSettings.tickrate;


    netServer.exports.changeState = function (data) {
        queue.push(data);
    }

    netServer.onConnect(function (conn) {
        console.log("Client ", conn.id, " adr:",conn.remoteAddress);

        var remote =netServer.getClient(conn.id);

        world.respawnPlayer(conn.id,remote);
        remote.connect(conn.id);
    });

    netServer.onDisconnect(function (conn){
        world.killPlayer(conn.id);
    });

    //Выполнить все задачи очереди
    function doActions() {
        while (queue.has()) {
            var data=queue.pop();
            var id = data.id;

            var result=world.doAction(data);
            sendSimularResult(result);      
        }
        world.syncAllStates();
    }

    //Возвращает результат симуляции
    function sendSimularResult(state) {
        state.remote.sendResult(state);
    }

    setInterval(doActions,tickrate);

    server.listen(staticSettings.port);
});