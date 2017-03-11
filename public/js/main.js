requirejs.config({
  baseUrl: '/',
  paths: {
    // Libs
    Phaser: 'node_modules/phaser-ce/build/phaser.min',

    // Game
    game: 'public/js/src'
  }
})(['game/Game']);
