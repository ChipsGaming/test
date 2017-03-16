if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function(require){
    World=require('./World');
    UnitState=require('./UnitState');
    ActionsQueue= require('./ActionsQueue');

    var netCore=require('./NetCore');
    var staticSettings=require('./StaticSettings');    
    
    var netServer=netCore.proxy;
    var server=netCore.server;
    var world=new World(staticSettings.step);
    var queue=new ActionsQueue();

    const tickrate=staticSettings.tickrate;



    netServer.exports.changeState = function (data) {
        queue.push(data);
    }

    netServer.onConnect(function (conn) {
        console.log("Client ", conn.id, " adr:",conn.remoteAddress);

        queue.regId(conn.id);

        var remote =netServer.getClient(conn.id);

        world.respawnPlayer(conn.id,remote);
        remote.connect(conn.id);
    });

    netServer.onDisconnect(function (conn){
        world.killPlayer(conn.id);
        queue.unregId(conn.id);
    });

    //Выполнить все задачи очереди
    function doActions() {
        while (queue.has()) {
            var data=queue.pop();
            var id = data.id;

            var result=world.doAction(data);

            console.log(data,result);

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