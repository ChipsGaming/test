requirejs.config({
  baseUrl: '/',
  paths: {
    // Libs
    Phaser: 'node_modules/phaser-ce/build/phaser.min',

    // Game
    modules: 'public/js/src/modules',
  }
})(['modules/Client']);