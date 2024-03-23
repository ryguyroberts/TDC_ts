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
    this.load.tilemapTiledJSON('tilemap', 'tech_map/tech_map05_test.json');

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
    this.load.tilemapTiledJSON('ui_tilemap','tech_map/tech_map03_ui.json');

    // Fonts
    this.load.bitmapFont('pixelFont', 'fonts/pixel_0.png', 'fonts/pixel.xml');

    // Right Panel UI
    this.load.image('ui_tilemap_towers', 'tech_map/enemies x2.png');
    this.load.image('tdc_logo', 'ui/TDC logo.png');
    this.load.image('tower_icon', 'ui/tower icon.png');
    this.load.image('tower_icon_2', 'ui/tower icon_2.png');
    this.load.image('tower_icon_3', 'ui/tower icon_3.png');

    // Left Panel UI
    this.load.image('left_panel', 'ui/Left UI Panel.png');
    this.load.image('destroy_button', 'ui/destroy button.png');
    this.load.image('hp_icon', 'ui/hp.png');
    this.load.image('currency', 'ui/coin.png');
    this.load.image('start_wave', 'ui/start button.png');
  
    // Main Menu
    this.load.image('main_menu_scene', "ui/TDC Title Scene.png");
    this.load.image('play_button', 'ui/play button.png')

    // Game Over
    this.load.image('game_over_scene', 'ui/GameOver Scene.png');
    this.load.image('try_again', 'ui/try again button.png');
    this.load.image('exit', 'ui/exit button.png');

    // BGM 
    this.load.audio('game_bgm', 'audio/Kubbi - Digestive biscuit.mp3');
    this.load.audio('menu_bgm', 'audio/Kevin MacLeod - 8bit Dungeon Level.mp3');
    this.load.audio('game_over_bgm', 'audio/gameover_bgm.mp3');

    // Button SFX
    this.load.audio('play_button_bleep', 'audio/bleep.mp3');
    this.load.audio('click', 'audio/8bitclick.mp3');

    // Gameplay SFX
    this.load.audio('wave_complete', 'audio/wave complete.mp3');
    this.load.audio('death_sound', 'audio/game over.mp3');
    
    // Tower SFX
    this.load.audio('tower_build', 'audio/buildtower.mp3');
    this.load.audio('tower_laser', 'audio/laser.mp3');
    this.load.audio('tower_destroy', 'audio/towerdestroy.mp3');

    // Mob SFX
    this.load.audio('mob_hit', 'audio/mob hit.mp3');
    this.load.audio('mob_death', 'audio/mobdeath.mp3');
  
  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('main_game');
  };

};