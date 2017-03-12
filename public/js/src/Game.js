define(function(require){
  var Phaser = require('Phaser'),
    Preload = require('game/Preload'),
    Create = require('game/Create'),
    Update = require('game/Update'),
    createStars = require('game/CreateStar');

  var game=new Phaser.Game (800,600, Phaser.AUTO, '', {
    preload: Preload,
    create: Create,
    update: Update
  }); 
  return game;
});
