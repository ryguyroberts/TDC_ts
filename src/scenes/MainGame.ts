import Phaser, { Tilemaps } from "phaser";
// import { debugDraw } from "../utils/debug";

// Import Animations
import { createFaunaAnims } from "../anims/FainaAnims";
import { createTower1Anims } from "../anims/Tower1Anims";
import { createMobTier1Anims } from "../anims/MobTier1Anims";

// import '../characters/Fauna'
// Import Sprites Classes
import '../characters/Fauna';
import '../towers/Tower1';
import '../enemies/MobTier1';

// Utitilies

// States from Mobx
import { reaction } from "mobx";
import { mobStore } from "../states/MobStore";


export class MainGame extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fauna!: Phaser.GameObjects.Sprite;
  // private spiderbot!: Phaser.GameObjects.Sprite;
  private tower1_01!: Phaser.GameObjects.Sprite;
  private tower1_02!: Phaser.GameObjects.Sprite;
  private tower1_03!: Phaser.GameObjects.Sprite;
  private mobGroup!: Phaser.Physics.Arcade.Group
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;


  constructor() {
    super('main_game');
    this.createMobTier1 = this.createMobTier1.bind(this); // Bind createSpider method to the current instance
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
  createMobTier1Anims(this.anims);

  // Test text
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

  reaction(
    () => Array.from(mobStore.mobs.entries()),
    () => updateSpiderTexts()
  );



    // let phaseLabel = this.add.text(20, 40, 'im a text', { fontSize: '32px', color: '#fffff' });
    // phaseLabel.setDepth(1);
    
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
    map.createLayer('props', allLayers)

    // Collision Debugging

    this.wallsLayer.setCollisionByProperty({ collides: true})
    // debugDraw(wallsLayer, this)

    // Create Fauna 
    this.fauna = this.add.fauna(100, 450, 'fauna')


    // Colliders
    this.physics.add.collider(this.fauna, this.wallsLayer);

     // Test Towers

    this.tower1_01 = this.add.tower1(176, 578, 'tower1');
    this.physics.add.existing(this.tower1_01);

    this.tower1_02 = this.add.tower1(176, 674, 'tower1');
    this.physics.add.existing(this.tower1_02);

    this.tower1_03 = this.add.tower1(176, 770, 'tower1');
    this.physics.add.existing(this.tower1_03);

   
    // Test spiders

    this.mobGroup = this.physics.add.group();

    

    // Create Player owned Tower Group

 


    // this.spiderbot = this.add.spiderbot(500, 200, 'spiderbot');
    // this.physics.add.existing(this.spiderbot);
    // this.physics.add.collider(this.spiderbot, this.wallsLayer)

    const spawnInterval = 2000; // milliseconds (e.g., spawn a spider every 5 seconds)
    this.time.addEvent({
      delay: spawnInterval,
      loop: true,
      callback: this.createMobTier1,
      callbackScope: this
    });

    };

  createMobTier1() {

    const mob_t1 = this.add.mob_t1(125, 450, 'mob_t1', 'mob_t1_run');
   // Add spider to the physics system if needed
    // Add to mobx?
    const mobID = Phaser.Math.RND.uuid()
    //set a property on our game object
    mob_t1.setData('id', mobID)

    // this.physics.add.existing(spider);
    this.physics.add.collider(mob_t1, this.wallsLayer); 
    // Add spider to the group
    this.mobGroup.add(mob_t1);

    mobStore.addMob(mobID, mob_t1);
    // remove spider after certain duration
    // const destructionDelay = 12000; // 5000 milliseconds = 5 seconds

    // this.time.delayedCall(destructionDelay, () => {
    //     spider.destroy(); // Destroy the spider after the delay
    //     spiderbotStore.removeSpiderbot(spiderID); // Remove spider from the store
    // }, [], this);

  }
  
  update() {
    if (this.fauna) {
      this.fauna.update(this.cursors);
    };
  }


};