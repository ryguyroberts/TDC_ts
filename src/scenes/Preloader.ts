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
    this.load.tilemapTiledJSON('tilemap', 'tech_map/tech_map04.json');

    // Sprites
    this.load.atlas('fauna', 'fauna/fauna.png', 'fauna/fauna.json');
    this.load.atlas('mob_t1', 'enemies/mob_t1.png', 'enemies/mob_t1.json')
    this.load.atlas('mob_t2', 'enemies/mob_t2.png', 'enemies/mob_t2.json')

    // Tower
    this.load.atlas('tower_t1', 'towers/tower_t1.png', 'towers/tower_t1.json')

    // Projectiles
    this.load.atlas('green_project', 'projectiles/green_project.png', 'projectiles/green_project.json')

    // UI
    this.load.image('ui_tilemap_left_ui', 'tech_map/ui x2.png');
    this.load.image('ui_tilemap_towers', 'tech_map/enemies x2.png');
    this.load.image('tdc_logo', 'ui/TDC logo.png');
    this.load.image('destroy_button', 'ui/destroy button.png')
    this.load.tilemapTiledJSON('ui_tilemap','tech_map/tech_map03_ui.json');

    // Main Menu
    this.load.image('main_menu_scene', "ui/TDC Title Scene.png");
    this.load.image('play_button', 'ui/play button.png')

    // Game Over
    this.load.image('game_over_scene', 'ui/GameOver Scene.png');
    this.load.image('try_again', 'ui/try again button.png');
    this.load.image('exit', 'ui/exit button.png');

  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('main_menu');
  };

};