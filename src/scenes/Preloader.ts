import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  };

  preload() {
    // Map
    this.load.image('tilemap_base_props1', 'tech_map/tileset x1.png');
    this.load.image('tilemap_base_props2', 'tech_map/tileset x2.png');
    this.load.image('tilemap_npcs', 'tech_map/npc x1.png');
    this.load.image('tilemap_items', 'tech_map/props and items x1.png');

    // The actual Map
    this.load.tilemapTiledJSON('tilemap', 'tech_map/tech_map03.json');
    // Sprites
    this.load.atlas('fauna', 'fauna/fauna.png', 'fauna/fauna.json');
    this.load.atlas('spiderbot', 'enemies/spiderbot.png', 'enemies/spiderbot.json')

    // Tower

    this.load.atlas('tower1', 'towers/tower1.png', 'towers/tower1.json')
    // UI

  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('main_game');
  };

};