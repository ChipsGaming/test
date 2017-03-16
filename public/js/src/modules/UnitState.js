if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function (require) {
    function UnitState(id,x,y) {
        this.x=x;
        this.y=y;
        this.id=id;
        this.keys=[];
    }
    
    UnitState.prototype.addCommand=function (cmdKey) {
        this.keys[this.keys.length]=cmdKey;
    }

    UnitState.prototype.isModifiable=function() {
        return this.keys.length>0;
    }
    
    UnitState.prototype.equal=function (eState) {
        return eState.x==this.x&&eState.y==this.y;
    }

    return UnitState;
});