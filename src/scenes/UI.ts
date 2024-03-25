import Phaser, { Tilemaps } from "phaser";

// Utils
// import { findSelectedTower } from "../utils/uiUtils";
// import { handlePointerOver, handlePointerOut } from "../utils/buttonPop";

// Mobx State
import { autorun, reaction, IReactionDisposer } from "mobx";
import { towerState } from "../states/TowerStore";
import selectedTowerState from "../states/selected_tower";
import { mobStore } from "../states/MobStore";
import { playerState } from "../states/PlayerState";
import { gamephase } from "../states/GamePhase";

//Map creation for towers placed


export class UI extends Phaser.Scene {
  private mobGroup!: Phaser.Physics.Arcade.Group;
  private tileSize: number;
  deleteTower: Phaser.GameObjects.Sprite;
  clickSFX: Phaser.Sound.BaseSound;
  // tower: Class;

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

    const towerIcon = this.add.sprite(1344, 160, 'tower_icon').setInteractive();
    towerIcon.setScale(1);

    // POINTEROVER/OUT events currently not working in UI for some reason.
    // towerIcon.on('pointerover', () => {
    //   console.log("you're hovering");
    //   handlePointerOver(towerIcon, 1.1, 1344, 160, 'pointer', this, this.clickSFX);
    // })

    // towerIcon.on('pointerout', () => {
    //   console.log("you're not hovering");
    //   handlePointerOut(towerIcon, 1, 1344, 160, 'default', this);
    // }) 

    const towerIcon2 = this.add.sprite(1441, 160, 'tower_icon_2').setInteractive();
    towerIcon2.setScale(1);

    const towerIcon3 = this.add.sprite(1537, 160, 'tower_icon_3').setInteractive();
    towerIcon3.setScale(1);


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
        let isPlacingTower = false;
        // Tower Sprite Creation
        towerSprite.on('pointerdown', (pointer: any, localX: number, localY: number) => {
          if(!isPlacingTower) {
            isPlacingTower = true
            const price = 100
            
              // Can't afford
            if (!playerState.buyTower(price)) {
              console.log('cannnot afford');
              isPlacingTower = false;
              return;
              // Can't afford
            };

            // start creating tower and pass to state
            console.log(towerObj.name);
            
           
            
            const tower = this.add.tower1(localX, localY, 'tower1');
            tower.setAlpha(0.5);
            const towerID = Phaser.Math.RND.uuid();
            towerState.addTower(towerID, tower);
            tower.placed = false;
            tower.setInteractive();


          };
          
        
          const tower = this.add.tower1(localX, localY, 'tower1');
          tower.setAlpha(0.5);
          const towerID = Phaser.Math.RND.uuid();
          towerState.addTower(towerID, tower);
          tower.placed = false;

          tower.setInteractive();

          let isPlaced = false;

          this.createTowerLayer();

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

            //console.log("grid x and y:", gridX, gridY);
          
            // Move tower to nearest grid position
            tower.x = gridX;
            tower.y = gridY;

            //console.log("tower x y", tower.x, tower.y);

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
            //console.log("tower", tower)

            //calls to pathfinding to update data
            //UI.createTowerLayer();

          });
        });
      }
    });

    // LEFT PANEL UI: PLAYER & GAME STATE
    const leftPanelBG = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'left_panel');
    leftPanelBG.setScale(1);

    let waveText = this.add.bitmapText(65, 48, 'pixelFont', 'WAVE: 1');
    waveText.setScale(1.25);

    const hpIcon = this.add.sprite(60, 177, 'hp_icon');
    hpIcon.setScale(0.10);

    let playerHp = this.add.bitmapText(130, 164, "pixelFont", "100");
    playerHp.setScale(1.25);

    const startWaveButton = this.add.sprite(150, 920, 'start_wave').setInteractive();
    startWaveButton.setScale(0.12);

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

    let autorunDisposer: IReactionDisposer;

    autorunDisposer = autorun(() => {
      currencyText.text = `${playerState.currency}`;
      playerHp.text = `${playerState.playerHealth}`;
      waveText.text = `WAVE: ${gamephase.wave}`;
      buildTime.setText(`BUILD: ${gamephase.buildtime} 
      TIME`);
    });

    // Delete tower button
    this.deleteTower = this.add.sprite(147, 385, 'destroy_button').setInteractive().setVisible(false);
    this.deleteTower.setScale(0.32);

    // this.deleteTower.on('pointerover', () => {
    //   handlePointerOver(this.deleteTower, 0.33, 147, 385, 'pointer', this);
    // });

    // this.deleteTower.on('pointerout', () => {
    //   handlePointerOut(this.deleteTower, 0.32, 147, 385, 'default', this);
    // })

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

    startWaveButton.on('pointerdown', () => {
      this.clickSFX = this.sound.add('click');
      this.clickSFX.play();
      // if combat stage don't advance change button text?
      if (gamephase.stage === 'combat') {
        return;
      }
      // Always switch to combat instead.
      gamephase.setStage('combat')
    });

    const recreateBitMapText = () => {
      autorunDisposer();

      waveText.destroy();
      waveText = this.add.bitmapText(65, 48, 'pixelFont', 'WAVE: 1', 32);
      waveText.setScale(1.25);

      playerHp.destroy();
      playerHp = this.add.bitmapText(130, 164, "pixelFont", "100", 32);
      playerHp.setScale(1.25);

      currencyText.destroy();
      currencyText = this.add.bitmapText(120, 280, 'pixelFont', `1000`, 32);
      currencyText.setScale(1.25);

      buildTime.destroy();
      buildTime = this.add.bitmapText(50, 810, 'pixelFont', 'Placeholder', 32);
    };


    reaction(
      () => {
        if (gamephase.stage === 'game_end') {
          console.log('we are going to destroy, recreate bitmap text, & dispose of autorun');
          return;
        }
      },
      () => recreateBitMapText()
    );


  }

  // End of create

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

        // Display tower info
        this.deleteTower.setVisible(true);
        // this.deleteTower.setColor('#ff0000').setFontSize(30);
        //this.displayTowerInfo(tower);
  
      }
    });
  }

  // private displayTowerInfo(tower: Phaser.GameObjects.Sprite) {
    // console.log(`Tower selected at position (${tower.x}, ${tower.y})`);
  // }


  private findSelectedTower(selectedTower: Phaser.GameObjects.Sprite): string | null {
    for (const [towerID, tower] of towerState.activeTowers.entries()) {
      if (tower === selectedTower) {
        //console.log("selectedTower:",selectedTower);
        return towerID;
        
      }
    }
    return null;
  }

  
  private createTowerLayer = () => {
  const towerLayer:string[] = [];
  
  towerState.activeTowers.forEach((tower) => {
    const towerX = Math.floor(tower.x / 32);
    const towerY = Math.floor(tower.y / 32);
    const towerKey = `${towerX}x${towerY}`;
  
     
    towerLayer.push(towerKey);
  
    // console.log("towerLayer array", towerLayer);
  });
  
  // console.log(UI.createTowerLayer)
  // Send to state instead

  towerState.setTowerLayer(towerLayer)
  // console.log(towerState.towerLayer);
  }

};
