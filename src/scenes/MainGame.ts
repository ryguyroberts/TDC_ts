import Phaser, { Tilemaps } from "phaser";
// import { debugDraw } from "../utils/debug";

// Import Animations
import { createFaunaAnims } from "../anims/FainaAnims";
import { createTower1Anims } from "../anims/Tower1Anims";
import { createSpiderbotAnims } from "../anims/SpiderbotAnims";

// import '../characters/Fauna'
// Import Sprites Classes
import '../characters/Fauna';
import '../towers/Tower1';
import '../enemies/Spiderbot';

// Utitilies

// States from Mobx

export class MainGame extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Phaser.GameObjects.Sprite;
  private spiderbot!: Phaser.GameObjects.Sprite;
  private tower1_01!: Phaser.GameObjects.Sprite;
  private tower1_02!: Phaser.GameObjects.Sprite;
  private tower1_03!: Phaser.GameObjects.Sprite;
  private spiderGroup!: Phaser.Physics.Arcade.Group
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;


  constructor() {
    super('main_game');
    this.createSpider = this.createSpider.bind(this); // Bind createSpider method to the current instance
  };


  preload() {
    // Cursors here
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
      } else {
        throw new Error("Keyboard input is not available.");
    }


  };

  create() {

  // Animations
  createFaunaAnims(this.anims);
  createTower1Anims(this.anims);
  createSpiderbotAnims(this.anims);
    
  // Tileset

    const map = this.make.tilemap({ key: 'tilemap' });

    const tilemap_base_props1 = map.addTilesetImage('Tech_TD_Ced', 'tilemap_base_props1');
    const tilemap_base_props2 = map.addTilesetImage('Tech_TD_Ced_02', 'tilemap_base_props2');
    const tilemap_npcs = map.addTilesetImage('npc x1', 'tilemap_npcs');
    const tilemap_items = map.addTilesetImage('props and items x1', 'tilemap_items');

    // Check if null
    if (!tilemap_base_props1 || !tilemap_base_props2 || !tilemap_npcs || !tilemap_items) {
      throw new Error("Failed to load tileset");
    }
        
    const allLayers: Tilemaps.Tileset[] = [tilemap_base_props1, tilemap_base_props2, tilemap_npcs, tilemap_items];

    map.createLayer('Tile Layer 1', allLayers);
    this.wallsLayer = map.createLayer('Wall Layer', allLayers) as Phaser.Tilemaps.TilemapLayer;
    map.createLayer('effect', allLayers)
    // Collision Debugging

    this.wallsLayer.setCollisionByProperty({ collides: true})
    // debugDraw(wallsLayer, this)

    // Create Fauna 
    this.fauna = this.add.fauna(600, 128, 'fauna')


    // Colliders
    this.physics.add.collider(this.fauna, this.wallsLayer);

     // Test Towers

    this.tower1_01 = this.add.tower1(784, 128, 'tower1');
    this.physics.add.existing(this.tower1_01);

    this.tower1_02 = this.add.tower1(884, 128, 'tower1');
    this.physics.add.existing(this.tower1_02);

    this.tower1_03 = this.add.tower1(984, 128, 'tower1');
    this.physics.add.existing(this.tower1_03);

   
    // Test spiders

    this.spiderGroup = this.physics.add.group();
    this.spiderbot = this.add.spiderbot(500, 200, 'spiderbot');
    this.physics.add.existing(this.spiderbot);
    this.physics.add.collider(this.spiderbot, this.wallsLayer)

    const spawnInterval = 5000; // milliseconds (e.g., spawn a spider every 5 seconds)
    this.time.addEvent({
      delay: spawnInterval,
      loop: true,
      callback: this.createSpider,
      callbackScope: this
    });
  };

  createSpider() {
    const spider = this.add.spiderbot(500, 200, 'spiderbot');
    // Add spider to the physics system if needed
    this.physics.add.existing(spider);
    this.physics.add.collider(spider, this.wallsLayer); 
    // Add spider to the group
    this.spiderGroup.add(spider);
  }
  
  update() {
    if (this.fauna) {
      this.fauna.update(this.cursors);
    };
  }
};