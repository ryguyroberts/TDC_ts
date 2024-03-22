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
// import { reaction } from "mobx";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";
import { reaction } from "mobx";
import { playerState } from "../states/PlayerState";
import MobTier1 from "../enemies/MobTier1";


export class MainGame extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // R.I.P
  // private fauna!: Fauna;


  private mobGroup!: Phaser.Physics.Arcade.Group;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private mobSpawnEvent: Phaser.Time.TimerEvent;
  private buildPhaseEndEv: Phaser.Time.TimerEvent;
  private buildPhaseEvent: Phaser.Time.TimerEvent;
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

    map.createLayer('Tile Layer 1', allLayers);
    this.wallsLayer = map.createLayer('Wall Layer', allLayers) as Phaser.Tilemaps.TilemapLayer;
    this.wallsLayer.setDepth(100);
    map.createLayer('effect', allLayers);
    map.createLayer('props', allLayers);

    // turn on collision based on tiled property
    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.groundLayer.setCollisionByProperty({ collides: false})

    // Collision Debugging
    // debugDraw(this.wallsLayer, this)


    // Test mobs
    this.mobGroup = this.physics.add.group();

    // Start in build Phase!
    this.startBuildPhase();

    // if gamephase changes react appropriately
    reaction(
      () => gamephase.stage,
      () => this.dynamicPhase()
    );

    // if mob enters array run my check if no more mobs end combat
    reaction(
      () => Array.from(mobStore.mobs.entries()),
      () => this.checkEndCombat()
    );
  };


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

    gamephase.buildtime = 60;

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
    });


    this.time.addEvent({
      delay: 1000, // Convert seconds to milliseconds
      callback: this.updateTimer,
      callbackScope: this
    });
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
    const spawnMobsWithDelay = (count: number) => {
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
    const mob_t1 = this.add.mob_t1(448, 0, 'mob_t1');
    // Add properties
    const mobID = Phaser.Math.RND.uuid();
    mob_t1.setData('id', mobID);

    // Add to physics system and collider
    // this.physics.add.existing(mob_t1);
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
    // this.physics.add.existing(mob_t2);
    //this.physics.add.collider(mob_t2, this.wallsLayer); 
  
    // Add to mob group and MobStore
    this.mobGroup.add(mob_t2);
    mobStore.addMob(mobID, mob_t2);
  // }
  }

  createTowerLayer = () => {
    const towerLayer = [];
  
    for (const [towerId, tower] of towerState.activeTowers.entries()) {
      const towerX = Math.floor(tower.x / 32);
      const towerY = Math.floor(tower.y / 32);
      const towerKey = `${towerX}x${towerY}`;
  
      towerLayer.push(towerKey);
      console.log("towerLayer array", towerLayer, towerId);
    }
  
    return towerLayer;
  };
  
  calculateAndMoveMob(mob: MobTier1) {

    const startVec = this.groundLayer.worldToTileXY(mob.x, mob.y);
    // console.log(startVec);
    const path = findPath(startVec, this.groundLayer, this.wallsLayer); // Use findPath function
    // console.log(path);
    // console.log(this.groundLayer.worldToTileXY(mob.x, mob.y))

    mob.moveAlong(path);
    // Move the mob along the path
    // mob.moveAlong(path);
  }

  update() {
    const mobEntries = Array.from(mobStore.mobs.entries());
    mobEntries.forEach(entry => {
      const mob = entry[1];

      this.calculateAndMoveMob(mob);
      mob.update();

      const endPointX = 1168; // change to endpoint when ready
      const endPointY = 200; // change to endpoint when ready
      if (mob.checkEndPoint(endPointX, endPointY)) {
        // Code the deletion of mob here 
        mob.decreaseHealth(mob.health, mob.getData('id'), this);
        playerState.takeDamage(5);
      }   

    });
  }
};