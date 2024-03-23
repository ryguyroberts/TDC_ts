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
import findPath from '../utils/findPath';
import { startBuildPhase, dynamicPhase, checkEndCombat} from '../utils/mobUtils';
// import { preprocessMapData } from "../utils/processMap";

// States from Mobx
// import { reaction } from "mobx";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";
import { reaction } from "mobx";
import { playerState } from "../states/PlayerState";
import MobTier1 from "../enemies/MobTier1";
import { towerState } from "../states/TowerStore";


export class MainGame extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // R.I.P
  // private fauna!: Fauna;


  private mobGroup!: Phaser.Physics.Arcade.Group;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  public mobSpawnEvent: Phaser.Time.TimerEvent;
  public buildPhaseEndEv: Phaser.Time.TimerEvent;
  public buildPhaseEvent: Phaser.Time.TimerEvent;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private notGroundLayer!: Phaser.Tilemaps.TilemapLayer;
  private bgm: Phaser.Sound.BaseSound;
  // private initialWavePlaySFX: boolean;

  constructor() {
    super('main_game');
  };


  preload() {
  };

  create() {

    // Launch UI scene
    this.scene.launch('ui', { mobGroup: this.mobGroup });

    // Audio
    this.bgm = this.sound.add('game_bgm', { loop: true, volume: 0.08 });
    this.bgm.play();
    // this.initialWavePlaySFX = true; // For wave_complete sfx, don't want to initialize on game startup

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

    this.notGroundLayer = map.createLayer('notGround', allLayers) as Phaser.Tilemaps.TilemapLayer;
    this.notGroundLayer.setTint();
   
    // map.createLayer('Tile Layer 1', allLayers);
    this.wallsLayer = map.createLayer('Wall Layer', allLayers) as Phaser.Tilemaps.TilemapLayer;
    // this.wallsLayer.setDepth(100);
    map.createLayer('effect', allLayers);
    map.createLayer('props', allLayers);



    // turn on collision based on tiled property
    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.groundLayer.setCollisionByProperty({ collides: false})
       

    // Collision Debugging // 
    // debugDraw(this.wallsLayer, this)

    // Test mobs // Physics is w/e
    this.mobGroup = this.physics.add.group();

    // Start in build Phase!
    startBuildPhase(this);


    // if gamephase changes react appropriately
    reaction(
      () => gamephase.stage,
      () => dynamicPhase(this, this.mobGroup)
    );


    // if mob enters array run my check if no more mobs end combat
    reaction(
      () => Array.from(mobStore.mobs.entries()),
      () => checkEndCombat()
    );
    this.checkPlayerHealth();
  };

  checkPlayerHealth() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (playerState.playerHealth <= 0) {
          this.restartGame();
          this.scene.stop('ui');
          this.bgm.stop();
          const deathSound = this.sound.add('death_sound');
          deathSound.play();
          this.scene.start('game_over');
        }
      },
      loop: true,
    });
  }
  
  restartGame() {
    this.time.removeAllEvents(); // stops all timer events
    playerState.reset();
    towerState.reset();
    mobStore.reset();
  }
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
      console.log(mob.x, mob.y);

      this.calculateAndMoveMob(mob);
      mob.update();

      const endPointX = 1068; // change to endpoint when ready
      const endPointY = 907; // change to endpoint when ready
      if (mob.checkEndPoint(endPointX, endPointY)) {
        // Code the deletion of mob here 
        mob.decreaseHealth(mob.health, mob.getData('id'), this);
        playerState.takeDamage(5);
      }   

    });
  }
};