import Phaser, { Tilemaps } from "phaser";

export class UI extends Phaser.Scene {
  tileSize: number;

  constructor() {
    super('ui');
    this.tileSize = 32;
  }

  create() {

    // UI Tilemap Creation
    const uiMap = this.make.tilemap({ key: 'ui_tilemap' });

    const tileset_ui = uiMap.addTilesetImage('ui x2', 'ui_tilemap_left_ui');
    const tilemap_tower_ui = uiMap.addTilesetImage('enemies x2', 'ui_tilemap_towers');
    const towers = uiMap.getObjectLayer('Tower Creation UI');

    // Error case if tileset is null
    if (!tileset_ui || !tilemap_tower_ui || !towers) {
      throw new Error("Failed to load UI tileset");
    }

    const allUiLayers: Tilemaps.Tileset[] = [tileset_ui, tilemap_tower_ui];

    uiMap.createLayer('Left Panel UI', allUiLayers);
    uiMap.createLayer('Right Panel UI', allUiLayers);

    // Iterate over tower objects
    towers.objects.forEach(towerObj => {
      console.log(towerObj);
      // Ensure towerObj is not null / undefined
      if (towerObj) {
        const towerSprite = this.add.rectangle(
          (towerObj.x ?? 0) + (towerObj.width ?? 0) / 2,
          (towerObj.y ?? 0) + (towerObj.height ?? 0) / 2,
          towerObj.width ?? 0,
          towerObj.height ?? 0
        );
        // Allows for Tower Icons to receive input
        towerSprite.setInteractive();

        // Tower Sprite Creation
        towerSprite.on('pointerdown', (pointer: any, localX: number, localY: number) => {
          const tower = this.add.sprite(localX, localY, 'insertTowerSprite');
          tower.setAlpha(0.5);
          // Update state for activeTowers here
          tower.setInteractive();

          this.input.on('pointermove', (pointer: any) => {
            tower.x = pointer.x;
            tower.y = pointer.y;
          });

          // Tower Placement
          this.input.on('pointerup', () => {
            // Calc nearest grid position where the pointer is
            const gridX = Math.floor(pointer.x / this.tileSize) * this. tileSize + this.tileSize / 2;
            const gridY = Math.floor(pointer.y / this.tileSize) * this. tileSize + this.tileSize / 2;

            // Move tower to nearest grid position
            tower.x = gridX;
            tower.y = gridY;

            // Restore opacity
            tower.setAlpha(1);

            //Remove pointermove listener
            this.input.off('pointermove');
          });

          // Select any active tower
          tower.on('pointerdown', () => {
            //
          });
        });
      }
    });

    // Text Properties
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#ffffff',
      fontSize: '16px',
    }
    
    // Delete tower button
    const deleteTower = this.add.text(0, 0, 'Delete Tower', textStyle).setInteractive();
    deleteTower.on('pointerdown', () => {
      // if (this.selectedTower) {
      //   // find index in tower state
      // }
    })


  }
}