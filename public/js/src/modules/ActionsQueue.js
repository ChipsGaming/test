if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function(require){

    Queue=require('./Queue');

    //Конструктор
    function ActionsQueue() {
        this.actionsQueue={};
        this.count=0;
        this.queue=new Queue();
    }

    //При подключении клиента
    ActionsQueue.prototype.regId = function (id) {
        this.actionsQueue[id]={};
        item=this.actionsQueue[id];
        item.inputs={};
        item.expectedId=0;
        this.count++;
    }

    //При отключении клиента
    ActionsQueue.prototype.unregId = function (id) {
        delete this.actionsQueue[id];
        this.count--;
    }

//--------------

    //Добавить команду в накопительную очередь
    ActionsQueue.prototype.push = function (data) {
        var item = this.actionsQueue[data.id];
        item.inputs[data.cmdId]=data;
        this.analize(item);       
    }

    //Добавляет в очередь только упорядоченные команды
    ActionsQueue.prototype.analize = function (item) {
        while (item.inputs[item.expectedId]!=undefined) {            
            var el=item.inputs[item.expectedId];            
            if (item.expectedId!=el.cmdId) console.log(el, item.expectedId);
            this.queue.push(el);
            item.expectedId++;
        }
    }    

    ActionsQueue.prototype.pop=function () {
        var item=this.queue.pop();     
        delete this.actionsQueue[item.id].inputs[item.cmdId];
        return item;
    }

    ActionsQueue.prototype.has=function () {
        return this.queue.has();
    }

    return ActionsQueue;
});