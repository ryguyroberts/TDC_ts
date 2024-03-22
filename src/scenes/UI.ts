import Phaser, { Tilemaps } from "phaser";

// Mobx State
import { autorun } from "mobx";
import { reaction } from "mobx";
import { towerState } from "../states/TowerStore";
import selectedTowerState from "../states/selected_tower";
import { mobStore } from "../states/MobStore";
import { playerState } from "../states/PlayerState";
import { gamephase } from "../states/GamePhase";



export class UI extends Phaser.Scene {
  private mobGroup!: Phaser.Physics.Arcade.Group;
  private tileSize: number;
  private deleteTower: Phaser.GameObjects.Sprite;
  private clickSFX: Phaser.Sound.BaseSound;

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
    // RIGHT PANEL UI: TOWER CREATION
    const towerLogo = this.add.sprite(1440, 80, 'tdc_logo');
    towerLogo.setScale(0.53, 0.65);
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
          if (playerState.buyTower(tower.price)) {
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

              // Remove pointermove listener
              this.input.off('pointermove');
              tower.placed = true;
              isPlaced = true;
              
              // Build Tower SFX
              const buildSFX = this.sound.add('tower_build');
              buildSFX.play();

              // Attach tower selection handler
              this.attachTowerSelection(tower);
            });
          }

        });
      }
    });

    // LEFT PANEL UI: PLAYER & GAME STATE
    const hpIcon = this.add.sprite(75, 190, 'hp_icon');
    hpIcon.setScale(0.14);
    const playerHp = this.add.text(120, 168, ": 100");
    playerHp.setScale(3);

    const currencyIcon = this.add.sprite(75, 280, 'currency');
    currencyIcon.setScale(0.35);
    const currencyText = this.add.text(120, 260, `Currency: 1000`);
    currencyText.setScale(3);

    autorun(() => {
      currencyText.text = `: ${playerState.currency}`;
      playerHp.text = `: ${playerState.playerHealth}`;
    });

    // playerState.

    // Delete_Text Properties
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#ffffff',
      fontSize: '16px',
    };

    // Delete tower button
    this.deleteTower = this.add.sprite(120, 380, 'destroy_button').setInteractive().setVisible(false);
    this.deleteTower.setScale(0.30);
    
    this.deleteTower.on('pointerdown', () => {
      if (selectedTowerState.selectedTower) {
        const towerToRemove = selectedTowerState.selectedTower;
        const id = this.findSelectedTower(towerToRemove);

        if (id !== null) {
          const towerObj = towerState.getTower(id);

          // Remove all projectiles currently active by the tower
          if (towerObj) {
            // Cease the firing of the tower
            towerObj.stopFiring();

            // ClickSFX
            // this.clickSFX = this.sound.add('click');
            // this.clickSFX.play();

            // Tower Destroy SFX
            const destroySFX = this.sound.add('tower_destroy');
            destroySFX.play();

            // Remove tower sprite from game
            towerObj.placed = false;
            towerToRemove.destroy();

            // Remove tower from active towers state 
            towerState.removeTower(id);
            this.deleteTower.setVisible(false);

          }

        } else {
          console.log('Selected tower not found in tower state');
        }
        selectedTowerState.deselectTower();
      } else {
        console.log('No tower selected for deletion');
      }
    });

    // Current phase Display for testing
    const gamePhaseText = this.add.text(10, 875, 'Current Phase: Placeholder', textStyle);

    const updategPT = () => {
      gamePhaseText.setText(`Current Phase: ${gamephase.stage}`);
    };
    // run once
    updategPT();

    // update text whenever the phase changes
    reaction(
      () => gamephase.stage,
      () => updategPT()
    );

    // Build phase timer
    const buildTime = this.add.text(10, 842, 'Placeholder', textStyle);
    const updateBT = () => {
      buildTime.setText(`Build Time: ${gamephase.buildtime}`);
    };
    updateBT();

    reaction(
      () => gamephase.buildtime,
      () => updateBT()
    );




    const NextPhase = this.add.text(10, 905, 'Toggle Combat', textStyle).setInteractive();
    NextPhase.on('pointerdown', () => {
      // if combat stage don't advance change button text?
      if (gamephase.stage === 'combat') {
        return;
      }
      gamephase.toggleStage();
    });


  }

  private attachTowerSelection(tower: Phaser.GameObjects.Sprite) {
    tower.on('pointerdown', () => {
      // If selected tower is already selected -> Deselect
      if (selectedTowerState.selectedTower === tower) {
        tower.clearTint();
        selectedTowerState.deselectTower();

        // Deactiviate Delete button
        this.deleteTower.setVisible(false);        
        // Remove tower info display here
      } else {

        if (selectedTowerState.selectedTower) {
          selectedTowerState.selectedTower.clearTint();
        }

        // Highlight tower
        tower.setTint(0xff000);

        // Update selectedTower state
        selectedTowerState.selectTower(tower);

        // Click SFX
        this.clickSFX = this.sound.add('click');
        this.clickSFX.play();

        // Display tower info
        this.deleteTower.setVisible(true);
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
