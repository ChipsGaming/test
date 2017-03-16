if(typeof define !== 'function'){
  var define = require('amdefine')(module);
}

define(function (require) {
    var staticSettings=require('./StaticSettings.js');
    var static = require('node-static');    
    var file=new static.Server('.');
    var netServer=new require('http').createServer(function(req, res) {
        file.serve(req, res);
    });
    
    var Eureca = require('eureca.io');
    var proxyServer=new Eureca.Server({allow:staticSettings.proxyMethods});
    proxyServer.attach(netServer);

    return {server:netServer, proxy:proxyServer};
});