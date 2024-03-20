import Phaser, { Tilemaps } from "phaser";

// Mobx State
import { reaction } from "mobx";
import { towerState } from "../states/TowerStore";
import selectedTowerState from "../states/selected_tower";
import { mobStore } from "../states/MobStore";



export class UI extends Phaser.Scene {
  private mobGroup!: Phaser.Physics.Arcade.Group;
  tileSize: number;

  init(data: any) {
    this.mobGroup = data.mobGroup;
  }

  constructor() {
    super('ui');
    this.tileSize = 32;
  }

  create() {
    // Init mobgroup
    this.mobGroup = this.physics.add.group();

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

    reaction(
      () => Array.from(mobStore.mobs.entries()),
      (mobs) => {
        mobs.forEach((entry) => {
          const mob = entry[1];
          this.mobGroup.add(mob);
        });
      },
    );

    // Iterate over tower objects
    towers.objects.forEach(towerObj => {
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
          const tower = this.add.tower1(localX, localY, 'tower1');
          tower.setAlpha(0.5);
          const towerID = Phaser.Math.RND.uuid();
          towerState.addTower(towerID, tower);
          tower.placed = false;

          tower.setInteractive();

          let isPlaced = false;

          this.input.on('pointermove', (pointer: any) => {
            if (isPlaced) return; // Ignore listener if placed 
            tower.x = pointer.x;
            tower.y = pointer.y;
          });

          // Tower Placement
          this.input.on('pointerup', () => {
            if (isPlaced) return; // Ignore listener if placed 

            // Calc nearest grid position where the pointer is
            const gridX = Math.floor(pointer.x / this.tileSize) * this.tileSize + this.tileSize / 2;
            const gridY = Math.floor(pointer.y / this.tileSize) * this.tileSize + this.tileSize / 2;

            // Move tower to nearest grid position
            tower.x = gridX;
            tower.y = gridY;

            // Restore opacity
            tower.setAlpha(1);

            //Remove pointermove listener
            this.input.off('pointermove');
            tower.placed = true;
            isPlaced = true;

            // Attach tower selection handler
            this.attachTowerSelection(tower);
          });
        });
      }
    });

    // Text Properties
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#ffffff',
      fontSize: '16px',
    };

    // Delete tower button
    const deleteTower = this.add.text(0, 0, 'Delete Tower', textStyle).setInteractive();
    deleteTower.on('pointerdown', () => {
      if (selectedTowerState.selectedTower) {
        const towerToRemove = selectedTowerState.selectedTower;
        const id = this.findSelectedTower(towerToRemove);

        if (id !== null) {
          const towerObj = towerState.getTower(id);

          // Remove all projectiles currently active by the tower
          if (towerObj) {
            // Cease the firing of the tower
            towerObj.stopFiring();

            towerObj.placed = false;
            // Remove tower sprite from game
            towerToRemove.destroy();

            // Remove tower from active towers state 
            towerState.removeTower(id);
          }
          
        } else {
          console.log('Selected tower not found in tower state');
        }
        selectedTowerState.deselectTower();
      } else {
        console.log('No tower selected for deletion');
      }
    });


  }

  private attachTowerSelection(tower: Phaser.GameObjects.Sprite) {
    tower.on('pointerdown', () => {
      // If selected tower is already selected -> Deselect
      if (selectedTowerState.selectedTower === tower) {
        tower.clearTint();
        console.log('youve deselected a tower', tower);
        selectedTowerState.deselectTower();
        // Remove tower info display here
      } else {

        if (selectedTowerState.selectedTower) {
          selectedTowerState.selectedTower.clearTint();
        }

        console.log('you selected a tower', tower);
        // Highlight tower
        tower.setTint(0xff000);

        // Update selectedTower state
        selectedTowerState.selectTower(tower);

        // Display tower info
        this.displayTowerInfo(tower);
      }
    });
  }

  private displayTowerInfo(tower: Phaser.GameObjects.Sprite) {
    console.log(`Tower selected at position (${tower.x}, ${tower.y})`);
  }

  private findSelectedTower(selectedTower: Phaser.GameObjects.Sprite): string | null {
    for (const [towerID, tower] of towerState.activeTowers.entries()) {
      if (tower === selectedTower) {
        return towerID;
      }
    }
    return null;
  }
}
