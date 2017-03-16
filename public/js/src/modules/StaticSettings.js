if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define (function (require) {
    var gParams={};

    //Перечисление методов доступных на стороне клиента
    gParams.proxyMethods=['connect','kill','update', 'sendResult'];
    //Тайминг сервера
    gParams.tickrate=10;
    //Порт прослушивания
    gParams.port=8000;
    //Шаг перемещения
    gParams.step=5;
    return gParams;
});