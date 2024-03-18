import Phaser from "phaser";

// Import Sprites

// Utitilies

// States from Mobx

export class MainGame extends Phaser.Scene {
  constructor() {
    super('main_game');
  };


  preload() {
    // Cursors here
  };

  create() {

  // Tileset
  // const map = this.make.tilemap({key:'map'});
    const map = this.make.tilemap({ key: 'mainmap' });
    const tileset = map.addTilesetImage('Dungeon Prison', 'tiles')

     if (!tileset) {
        throw new Error("Failed to load tileset");
    }  
    map.createLayer('Ground', tileset);


    const wallsLayer = map.createLayer('Walls', tileset);

    if (!wallsLayer) {
      throw new Error("Failed to load tileset");
    } 

    wallsLayer.setCollisionByProperty({ collides: true})

    
  // // const tileset = map.addTilesetImage('tech_towers', 'tiles', 32, 32);

  // console.log(map)
  // // map.createLayer('Floor', tileset)

  };

};