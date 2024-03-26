import Phaser, { Tilemaps } from "phaser";

// Utils
// import { findSelectedTower } from "../utils/uiUtils";
import { handlePointerOver, handlePointerOut } from "../utils/buttonPop";
import { attachTowerSelection, findSelectedTower, cannotAffordTower, createTowerRangeDisplay, updateTowerRangeDisplay } from "../utils/uiUtils";

// Mobx State
import { autorun, reaction } from "mobx";
import { towerState } from "../states/TowerStore";
import selectedTowerState from "../states/selected_tower";
import { mobStore } from "../states/MobStore";
import { playerState } from "../states/PlayerState";
import { gamephase } from "../states/GamePhase";

export class UI extends Phaser.Scene {
  private mobGroup!: Phaser.Physics.Arcade.Group;
  tileSize: number;
  isPlacingTower: boolean;
  buildTowerSFX: Phaser.Sound.BaseSound;
  clickSFX: Phaser.Sound.BaseSound;
  deleteTower: Phaser.GameObjects.Sprite;
  isContinuousBuilding: boolean = false;

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

    // Init SFX
    this.buildTowerSFX = this.sound.add('tower_build');
    this.clickSFX = this.sound.add('click');

    // Error case if tileset is null
    if (!tileset_ui || !tilemap_tower_ui || !towers) {
      throw new Error("Failed to load UI tileset");
    }

    const allUiLayers: Tilemaps.Tileset[] = [tileset_ui, tilemap_tower_ui];

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

    // RIGHT PANEL UI: TOWER ICONS
    const towerLogo = this.add.sprite(1440, 80, 'tdc_logo');
    towerLogo.setScale(0.53, 0.65);

    const basicTowerIcon = this.add.sprite(1344, 160, 'tower_icon').setInteractive({ useHandCursor: true });
    basicTowerIcon.setScale(1);

    const longRangeTowerIcon = this.add.sprite(1441, 160, 'tower_icon_2').setInteractive();
    longRangeTowerIcon.setScale(1);

    const machineGunTowerIcon = this.add.sprite(1537, 160, 'tower_icon_3').setInteractive();
    machineGunTowerIcon.setScale(1);

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
        this.isPlacingTower = false;

        // TowerSprite pointerover and pointerout listeners 
        towerSprite.on('pointerover', () => {
          if (towerObj.id === 2) {
            handlePointerOver(basicTowerIcon, 1.1, 1344, 160, 'pointer', this, this.clickSFX);
          } else if (towerObj.id === 3) {
            handlePointerOver(longRangeTowerIcon, 1.1, 1441, 160, 'pointer', this, this.clickSFX);
          } else {
            handlePointerOver(machineGunTowerIcon, 1.1, 1537, 160, 'pointer', this, this.clickSFX);
          }
        });

        towerSprite.on('pointerout', () => {
          if (towerObj.id === 2) {
            handlePointerOut(basicTowerIcon, 1, 1344, 160, 'default', this);
          } else if (towerObj.id === 3) {
            handlePointerOut(longRangeTowerIcon, 1, 1441, 160, 'default', this);
          } else {
            handlePointerOut(machineGunTowerIcon, 1, 1537, 160, 'default', this);
          }
        });

        // Tower Creation
        towerSprite.on('pointerdown', (pointer: any) => {
          if (!(gamephase.stage === 'combat')) { // Tower Placement Only Allowed in Build Phase

            // Enables towers to only be moved/placed once and not after placement
            if (!this.isPlacingTower) {
              this.isPlacingTower = true;
              let price = 0;
              // this.isContinuousBuilding = true;

              // Create Basic Tower  
              if (towerObj.id === 2) {
                price = 100;
                if (!cannotAffordTower(price, this)) {
                  this.createTower(pointer, this.add.tower1(pointer.x, pointer.y, 'tower1'));
                }

                // Create Long Range Tower
              } else if (towerObj.id === 3) {
                price = 200;
                if (!cannotAffordTower(price, this)) {
                  this.createTower(pointer, this.add.tower2(pointer.x, pointer.y, 'tower1'));
                }

                // Create Machine Gun Tower
              } else {
                price = 300;
                if (!cannotAffordTower(price, this)) {
                  this.createTower(pointer, this.add.tower3(pointer.x, pointer.y, 'tower1'));
                }
              }
            };
          }
        });
      }
    });

    // LEFT PANEL UI: PLAYER & GAME STATE
    const leftPanelBG = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'left_panel');
    leftPanelBG.setScale(1);

    // Wave Text
    let waveText = this.add.bitmapText(65, 48, 'pixelFont', 'WAVE: 1');
    waveText.setScale(1.25);

    // Player HP Icon & Text
    const hpIcon = this.add.sprite(60, 177, 'hp_icon');
    hpIcon.setScale(0.10);
    let playerHp = this.add.bitmapText(130, 164, "pixelFont", "100");
    playerHp.setScale(1.25);

    // Currency Icon & Text 
    const currencyIcon = this.add.sprite(60, 293, 'currency');
    currencyIcon.setScale(0.25);
    let currencyText = this.add.bitmapText(120, 280, 'pixelFont', `1000`);
    currencyText.setScale(1.25);

    if (playerState.currency >= 1000) { // Adjust text position if < 1000
      currencyText.setPosition(120, 280);
    } else {
      currencyText.setPosition(130, 280);
    }

    // Build phase timer
    let buildTime = this.add.bitmapText(50, 810, 'pixelFont', 'Placeholder');

    // Updates text if when changes occur to them
    autorun(() => {
      currencyText.text = `${playerState.currency}`;
      playerHp.text = `${playerState.playerHealth}`;
      waveText.text = `WAVE: ${gamephase.wave}`;
      buildTime.setText(`BUILD: ${gamephase.buildtime} 
      TIME`);
    });

    // Delete tower button
    this.deleteTower = this.add.sprite(147, 385, 'destroy_button').setInteractive({ useHandCursor: true }).setVisible(false);
    this.deleteTower.setScale(0.32);

    // Delete Button pointerover & pointerout listener
    this.deleteTower.on('pointerover', () => {
      handlePointerOver(this.deleteTower, 0.33, 147, 385, 'pointer', this);
    });

    this.deleteTower.on('pointerout', () => {
      handlePointerOut(this.deleteTower, 0.32, 147, 385, 'default', this);
    });

    // Deletion of Towers
    this.deleteTower.on('pointerdown', () => {
      if (selectedTowerState.selectedTower) {
        const towerToRemove = selectedTowerState.selectedTower;
        const id = findSelectedTower(towerToRemove);

        if (id !== null) {
          const towerObj = towerState.getTower(id);

          // Remove all projectiles currently active by the tower
          if (towerObj) {
            // Cease the firing of the tower
            towerObj.stopFiring();

            // Tower Destroy SFX
            const destroySFX = this.sound.add('tower_destroy');
            destroySFX.play();

            // Remove tower sprite from game
            towerObj.placed = false;
            towerToRemove.destroy();

            // Remove tower range display
            selectedTowerState.getCurrentTowerRangeDisplay()?.destroy();

            // Remove tower from active towers state 
            towerState.removeTower(id);
            this.deleteTower.setVisible(false);
            this.createTowerLayer();

          }

        }
        selectedTowerState.deselectTower();
      }
    });

    // Start Wave Button
    const startWaveButton = this.add.sprite(150, 920, 'start_wave').setInteractive();
    startWaveButton.setScale(0.12);

    // Start Wave Visibility based on stage 
    reaction(
      () => gamephase.stage,
      (stage) => {
        if (stage === 'build') {
          startWaveButton.setVisible(true);
          buildTime.setVisible(true);

          // Removes Timer & Start Wave Button in Combat
        } else if (stage === 'combat') {
          startWaveButton.setVisible(false);
          buildTime.setVisible(false);
        }
      }
    );

    // Start Wave
    startWaveButton.on('pointerdown', () => {
      this.clickSFX.play();
      // if combat stage don't advance change button text?
      if (gamephase.stage === 'combat') {
        return;
      }
      // Always switch to combat instead.
      gamephase.setStage('combat');
    });
  }
  // End of create

  private createTower = (pointer: any, towerClass: any) => {
    const tower = towerClass;
    tower.setAlpha(0.5);
    const towerID = Phaser.Math.RND.uuid();
    towerState.addTower(towerID, tower);
    tower.placed = false;

    tower.setInteractive();

    let isPlaced = false;

    this.createTowerLayer();
    const towerRangeDisplay = createTowerRangeDisplay(tower, tower.shootRange, this);

    const updateRangeDisplay = (pointer: any) => {
      if (isPlaced) return; // Ignore listener if placed 
      tower.x = pointer.x;
      tower.y = pointer.y;
      updateTowerRangeDisplay(towerRangeDisplay, tower.shootRange, tower);
    };

    this.input.on('pointermove', updateRangeDisplay);

    // Tower Placement
    this.input.on('pointerup', () => {
      if (isPlaced) return; // Ignore listener if placed 

      // Calc nearest grid position where the pointer is
      const gridX = Math.floor(pointer.x / this.tileSize) * this.tileSize + this.tileSize / 2;
      const gridY = Math.floor(pointer.y / this.tileSize) * this.tileSize + this.tileSize / 2;

      // Move tower to nearest grid position
      tower.x = gridX;
      tower.y = gridY;

      // Update Tower radius to use grid position
      updateTowerRangeDisplay(towerRangeDisplay, tower.shootRange, tower);

      // Restore opacity
      tower.setAlpha(1);

      // Remove pointermove listener
      this.input.off('pointermove');
      tower.placed = true;
      isPlaced = true;
      this.isPlacingTower = false;
      towerRangeDisplay.setVisible(false);

      // Build Tower SFX
      this.buildTowerSFX.play();

      // Attach tower selection handler
      attachTowerSelection(tower, this, towerRangeDisplay);
    });
  };

  //function called upon to provide pathfinding the new locations of towers
  private createTowerLayer = () => {
  const towerLayer = [];
  
  for (const [towerId, tower] of towerState.activeTowers.entries()) {
    const towerX = Math.floor(tower.x / 32);
    const towerY = Math.floor(tower.y / 32);
    const towerKey = `${towerX}x${towerY}`;
    towerId;
  
    towerLayer.push(towerKey);
  }
  
  // Send to state instead
  towerState.setTowerLayer(towerLayer)
  }

  // validTowerPlacement = (tower: Phaser.GameObjects.Sprite) => {
  //   let validPlacement = false;
  //   let occupied = towerState.towerLayer;

  //   const towerX = Math.floor(tower.x / 32);
  //   const towerY = Math.floor(tower.y / 32);
  //   const towerKey = `${towerX}x${towerY}`;
    
  //   if (towerX < 10 && towerX > 39 ) {
  //     console.log("cannot place tower here")
  //   }

  //   if (occupied.includes(towerKey)) {
  //     console.log("cannot place tower on another tower")
  //   }

  //   if (!findPath) {
  //     console.log("no path found")
  //   }

  //   else validPlacement = true;

  //   return validPlacement;
  // }
  
};
