import Phaser, { Tilemaps } from "phaser";
// import { debugDraw } from "../utils/debug";

// Import Animations
import { createTowerTier1Anims } from "../anims/TowerTier1Anims";
import { createMobTier1Anims } from "../anims/MobTier1Anims";
import { createMobTier2Anims } from "../anims/MobTier2Anims";
import { createGreenProjectAnims } from "../anims/GreenProjectAnims";


// Import Sprites Classes
import '../towers/Tower1';
import '../enemies/MobTier1';
import '../enemies/MobTier2';

// Utitilies
import findPath from '../utils/findPath'

// States from Mobx
import { reaction } from "mobx";
import { mobStore } from "../states/MobStore";
import MobTier1 from "../enemies/MobTier1";


export class MainGame extends Phaser.Scene {

  // So many towers
  // private tower1_01!: Phaser.GameObjects.Sprite;
  // private tower1_02!: Phaser.GameObjects.Sprite;
  // private tower1_03!: Phaser.GameObjects.Sprite;
  // private tower1_04!: Phaser.GameObjects.Sprite;

  private mobGroup!: Phaser.Physics.Arcade.Group;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;


  constructor() {
    super('main_game');
  };


  preload() {
  };

  create() {

  // Launch UI scene
  this.scene.launch('ui', { mobGroup: this.mobGroup });

  // Animations
  createTowerTier1Anims(this.anims);
  createMobTier1Anims(this.anims);
  createMobTier2Anims(this.anims);
  createGreenProjectAnims(this.anims);

  // Test text Displays mobstate
  const spiderTexts: Phaser.GameObjects.Text[] = [];

  // Function to update the text
  const updateSpiderTexts = () => {
    spiderTexts.forEach((text) => text.destroy());
    let index = 0;
    mobStore.mobs.forEach((spiderbot, id) => {
      const text = this.add.text(20, 40 + index * 20, `ID: ${id}, HP: ${spiderbot.health}`, {
        fontSize: "16px",
        color: "#ffffff",
      });
      spiderTexts.push(text);
      index++;
    });
  };
  // Initial update
  updateSpiderTexts();

  // Watch for change
  reaction(
    () => Array.from(mobStore.mobs.entries()),
    () => updateSpiderTexts()
  );
    
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

    this.groundLayer = map.createLayer('Tile Layer 1', allLayers) as Phaser.Tilemaps.TilemapLayer;
    this.wallsLayer = map.createLayer('Wall Layer', allLayers) as Phaser.Tilemaps.TilemapLayer;
    map.createLayer('effect', allLayers)
    map.createLayer('props', allLayers)

    // turn on collision based on tiled property
    this.wallsLayer.setCollisionByProperty({ collides: true})
    this.groundLayer.setCollisionByProperty({ collides: false})

    // Collision Debugging
    // debugDraw(wallsLayer, this)


    // Test Towers

    // this.tower1_01 = this.add.tower1(176, 578, 'tower1',);
    // this.physics.add.existing(this.tower1_01);

    // this.tower1_02 = this.add.tower1(176, 674, 'tower1');
    // this.physics.add.existing(this.tower1_02);

    // this.tower1_03 = this.add.tower1(176, 770, 'tower1');
    // this.physics.add.existing(this.tower1_03);
   
    // this.tower1_04 = this.add.tower1(176, 862, 'tower1');
    // this.physics.add.existing(this.tower1_04);

    // Test mobs
    this.mobGroup = this.physics.add.group();
   
    // Spawn mobs for testing
    const spawnInterval = 1000; // milliseconds (e.g., spawn a spider every 5 seconds)

    this.time.addEvent({
      delay: spawnInterval,
      loop: true,
      callback: this.createMobRandom,
      callbackScope: this
    });

    this.time.addEvent({
      delay: 0,
      loop: false,
      callback: this.createMobRandom,
      callbackScope: this
    });

  };

  createMobRandom() {
    // Randomly decide whether to create MobTier1 or MobTier2
    const randomMobType = Phaser.Math.RND.between(1, 2);
  
    if (randomMobType === 1) {
      this.createMobTier1();
      console.log('num of spiders in the spiderGroup', this.mobGroup);
    } else {
      // console.log('made a mob2');
      this.createMobTier2();
      console.log('num of spiders in the spiderGroup', this.mobGroup);
    }
  }
  
  createMobTier1() {
    const mob_t1 = this.add.mob_t1(448, 0, 'mob_t1');
    // Add properties
    const mobID = Phaser.Math.RND.uuid();
    mob_t1.setData('id', mobID);
  
    // Add to physics system and collider
    this.physics.add.existing(mob_t1);
    //this.physics.add.collider(mob_t1, this.wallsLayer); 
  
    // Add to mob group and MobStore why both Ryan?
    this.mobGroup.add(mob_t1);
    mobStore.addMob(mobID, mob_t1);
  }
  
  createMobTier2() {
    const mob_t2 = this.add.mob_t2(448, 0, 'mob_t1');
    // Add properties
    const mobID = Phaser.Math.RND.uuid();
    mob_t2.setData('id', mobID);
  
    // Add to physics system and collider
    this.physics.add.existing(mob_t2);
    //this.physics.add.collider(mob_t2, this.wallsLayer); 
  
    // Add to mob group and MobStore
    this.mobGroup.add(mob_t2);
    mobStore.addMob(mobID, mob_t2);
  }


  

  calculateAndMoveMob(mob: MobTier1) {


    const startVec = this.groundLayer.worldToTileXY(mob.x, mob.y);
    const path = findPath(startVec, this.groundLayer, this.wallsLayer); // Use findPath function
    console.log(this.groundLayer.worldToTileXY(mob.x, mob.y))

    // Move the mob along the path
    mob.moveAlong(path);
  }

  update() {
    const mobEntries = Array.from(mobStore.mobs.entries());
  mobEntries.forEach(entry => {
    const mob = entry[1];

    this.calculateAndMoveMob(mob);
    mob.update();
  })
  }
};