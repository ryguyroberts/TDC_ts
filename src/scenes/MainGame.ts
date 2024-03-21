import Phaser, { Tilemaps } from "phaser";
// import { debugDraw } from "../utils/debug";

// Import Animations

import { createTowerTier1Anims } from "../anims/TowerTier1Anims";
import { createMobTier1Anims } from "../anims/MobTier1Anims";
import { createMobTier2Anims } from "../anims/MobTier2Anims";
import { createGreenProjectAnims } from "../anims/GreenProjectAnims";

// import '../characters/Fauna'
// Import Sprites Classes
import '../towers/Tower1';
import '../enemies/MobTier1';
import '../enemies/MobTier2';

// Utitilies
// import findPath from '../utils/findPath'

// States from Mobx
// import { reaction } from "mobx";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";
import { reaction } from "mobx";

export class MainGame extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // So many towers
  // private tower1_01!: Phaser.GameObjects.Sprite;
  // private tower1_02!: Phaser.GameObjects.Sprite;
  // private tower1_03!: Phaser.GameObjects.Sprite;
  // private tower1_04!: Phaser.GameObjects.Sprite;

  private mobGroup!: Phaser.Physics.Arcade.Group;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private mobSpawnEvent: Phaser.Time.TimerEvent;
  private buildPhaseEndEv: Phaser.Time.TimerEvent;
  private buildPhaseEvent: Phaser.Time.TimerEvent;

  constructor() {
    super('main_game');
  };


  preload() {
    // Cursors here
    //   if (this.input.keyboard) {
    //     this.cursors = this.input.keyboard.createCursorKeys();
    //   } else {
    //     throw new Error("Keyboard input is not available.");
    // };
  };

  create() {

  // Launch UI scene
  this.scene.launch('ui', { mobGroup: this.mobGroup });

  // Animations

  createTowerTier1Anims(this.anims);
  createMobTier1Anims(this.anims);
  createMobTier2Anims(this.anims);
  createGreenProjectAnims(this.anims);


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

    map.createLayer('Tile Layer 1', allLayers)
    this.wallsLayer = map.createLayer('Wall Layer', allLayers) as Phaser.Tilemaps.TilemapLayer;
    map.createLayer('effect', allLayers)
    map.createLayer('props', allLayers)

    // turn on collision based on tiled property
    this.wallsLayer.setCollisionByProperty({ collides: true})

    // Collision Debugging
    // debugDraw(wallsLayer, this)

    
  
    // Test mobs
    this.mobGroup = this.physics.add.group();

    // Start in build Phase!
    this.startBuildPhase()
    
    // this.time.addEvent({
    //   delay: 15000, // Our Time Delay
    //   loop: true,
    //   callback: this.togglePhase,
    //   callbackScope: this
    // });

    // if gamephase changes react appropriately
    reaction(
      () => gamephase.stage,
      () => this.dynamicPhase()
    );
      
    // if mob enters array run my check if no more mobs end combat
    reaction(
      () => Array.from(mobStore.mobs.entries()),
      () => this.checkEndCombat()
    )

  };

// Method to toggle between build and combat phases for machines?
// togglePhase() {
//   gamephase.toggleStage();
//   if (gamephase.stage === 'build') {
//     this.startBuildPhase();
//   } else {
//     this.startCombatPhase();
//   }
// }

// if mobx state has no mobs (all dead) enter build stage

checkEndCombat() {
  const mobEntries = Array.from(mobStore.mobs.entries());
  if (mobEntries.length === 0) {
    // If there are no mobs left, transition to the build phase
    gamephase.stage = 'build';
  }
}


// If the mobX state changes start the right stage
dynamicPhase() {
  if (gamephase.stage === 'build') {
    this.startBuildPhase();
  } else {
    // starting the combat phase

    // Remove build phase natural end.
        if (this.buildPhaseEndEv) {
      this.buildPhaseEndEv.remove(false);
      this.buildPhaseEvent.remove(false);
    }
    // Build timer zero
    gamephase.buildtime = 0;
    this.startCombatPhase();
  }
}


  // Build phase!
  startBuildPhase() {
    console.log('Build Phase Started');

    // Stop spawning mobs
    if (this.mobSpawnEvent) {
      this.mobSpawnEvent.remove(false);
    };

    gamephase.buildtime = 61;

 // Set a timed event to update build time every second
  this.buildPhaseEvent = this.time.addEvent({
    delay: 1000, // Delay of 1 second
    callback: () => {
      this.updateTimer();
    },
    callbackScope: this,
    loop: true // Set loop to true to repeat the event
    });



    const buildTime = 60;
    this.buildPhaseEndEv = this.time.addEvent({
      delay: buildTime * 1000, // Convert seconds to milliseconds
        callback: this.endBuild,
        callbackScope: this
    })

    this.time.addEvent({
      delay: 1000, // Convert seconds to milliseconds
        callback: this.updateTimer,
        callbackScope: this
    })
  };

  endBuild() {
    console.log('end build stage');
    gamephase.toggleStage();
  }
  
  
  updateTimer() {
    // increment by 1
    gamephase.updateTimerAction();

  }


  // Combat phase start no way to auto end right
  startCombatPhase() {
    console.log('Combat Phase started');
    // Start mob spawning
    const numberOfMobsToSpawn = 30; // Adjust this number as needed
    const spawnDelay = 1000; // Adjust this delay (in milliseconds) as needed

    // Function to spawn mobs with a delay
    const spawnMobsWithDelay = (count : number) => {
        if (count > 0) {
            // Spawn a mob
            this.createMobRandom();
            // Call the function recursively after the delay
            this.time.delayedCall(spawnDelay, spawnMobsWithDelay, [count - 1]);
        }
    };

    // Start spawning mobs with delay
    spawnMobsWithDelay(numberOfMobsToSpawn);



    // this.phaseChangeEvent.reset({ delay: 15000 });
  }

  

 // Move these out somehow? 
  createMobRandom() {
    // Randomly decide whether to create MobTier1 or MobTier2
    const randomMobType = Phaser.Math.RND.between(1, 2);
  
    if (randomMobType === 1) {
      this.createMobTier1();
      // console.log('num of mobs in the mobGroup', this.mobGroup.getLength());
    } else {
      // console.log('made a mob2');
      this.createMobTier2();
      // console.log('num of mobs in the mobGroup', this.mobGroup.getLength());
    }
  }
  

  // Make it dryer somehow?
  createMobTier1() {
    const mob_t1 = this.add.mob_t1(400, 200, 'mob_t1');
    // Add properties
    const mobID = Phaser.Math.RND.uuid();
    mob_t1.setData('id', mobID);
  
    // Add to physics system and collider
    this.physics.add.existing(mob_t1);
    this.physics.add.collider(mob_t1, this.wallsLayer); 
  
    // Add to mob group and MobStore why both Ryan?
    this.mobGroup.add(mob_t1);
    mobStore.addMob(mobID, mob_t1);
  }
  
  createMobTier2() {
    const mob_t2 = this.add.mob_t2(400, 200, 'mob_t1');
    // Add properties
    const mobID = Phaser.Math.RND.uuid();
    mob_t2.setData('id', mobID);
  
    // Add to physics system and collider
    this.physics.add.existing(mob_t2);
    this.physics.add.collider(mob_t2, this.wallsLayer); 
  
    // Add to mob group and MobStore
    this.mobGroup.add(mob_t2);
    mobStore.addMob(mobID, mob_t2);
  }

  update() {
  }
};