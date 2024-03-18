import Phaser, { Tilemaps } from "phaser";
import { debugDraw } from "../utils/debug";

// Import Animations
import { createFaunaAnims } from "../anims/FainaAnims";

// import '../characters/Fauna'
// Import Sprites Classes
import '../characters/Fauna.ts';


// Utitilies

// States from Mobx

export class MainGame extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Phaser.GameObjects.Sprite;


  constructor() {
    super('main_game');
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
    const wallsLayer = map.createLayer('Wall Layer', allLayers)
    map.createLayer('props', allLayers)
    map.createLayer('effect', allLayers)
    // Collision Debugging

    if (!wallsLayer) {
      throw new Error("Failed to load Wall layer");
    }
    wallsLayer.setCollisionByProperty({ collides: true})
    debugDraw(wallsLayer, this)

    // Create Fauna 
    this.fauna = this.add.fauna(600, 128, 'fauna')

    // Colliders
    this.physics.add.collider(this.fauna, wallsLayer);


  };

  
  update() {
    if (this.fauna) {
      this.fauna.update(this.cursors);
    };
  }
};