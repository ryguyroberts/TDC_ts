import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  };

  preload() {
    // Map
    this.load.image('tiles', 'test_map/Tiles.png');
    this.load.tilemapTiledJSON('mainmap', 'test_map/dungeon_02.json')
    // Sprites

    // UI

  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('main_game');
  };

};