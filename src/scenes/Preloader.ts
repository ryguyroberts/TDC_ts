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
    
    
    this.load.tilemapTiledJSON('tilemap', 'tech_map/tech_map03.json');
    // Sprites
    
    // UI
    this.load.image('ui_tilemap_left_ui', 'tech_map/ui x2.png');
    this.load.image('ui_tilemap_towers', 'tech_map/enemies x2.png');
    this.load.tilemapTiledJSON('ui_tilemap','tech_map/tech_map03_ui.json');

  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('main_game');
  };

};