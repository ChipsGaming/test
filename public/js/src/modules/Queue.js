if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function(require){
    ActionsQueue=function () {
        this.queue=[];
    }

    ActionsQueue.prototype.push =function (e) {
        this.queue.push(e);
    }

    ActionsQueue.prototype.pop = function () {
        return this.queue.pop();
    }

    ActionsQueue.prototype.has=function () {
        return this.queue.length>0;
    }

    return new ActionsQueue();
});