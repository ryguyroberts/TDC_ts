import Phaser from "phaser";
import selectedTowerState from "../states/selected_tower";
import { towerState } from "../states/TowerStore";
import { playerState } from "../states/PlayerState";

class BaseScene extends Phaser.Scene {
  clickSFX: Phaser.Sound.BaseSound;
  deleteTower: Phaser.GameObjects.Sprite;
  isPlacingTower: boolean;
  buildTowerSFX: Phaser.Sound.BaseSound;
  tileSize: number;

  constructor(key: string) {
    super(key);
  }
}

function attachTowerSelection(tower: Phaser.GameObjects.Sprite, context: BaseScene, towerRangeDisplay: Phaser.GameObjects.Arc) {
  tower.on('pointerdown', () => {
    // If selected tower is already selected -> Deselect
    if (selectedTowerState.selectedTower === tower) {
      tower.clearTint();
      selectedTowerState.deselectTower();

      // Deactiviate Delete button
      context.deleteTower.setVisible(false);

      // Remove tower info display here
      towerRangeDisplay.setVisible(false);
    } else {

      // Deselect prev tower and hide its range display
      if (selectedTowerState.selectedTower) {
        selectedTowerState.selectedTower.clearTint();
        selectedTowerState.deselectTower();
        selectedTowerState.previousTowerRangeDisplay?.setVisible(false);
      }

      // Highlight tower
      tower.setTint(0xff000);

      // Update selectedTower state
      selectedTowerState.selectTower(tower);

      // Click SFX
      context.clickSFX = context.sound.add('click');
      context.clickSFX.play();

      // Display tower delete & tower range 
      context.deleteTower.setVisible(true);
      towerRangeDisplay.setVisible(true);
      selectedTowerState.setPreviousTowerRangeDisplay(towerRangeDisplay);
    }
  });
}

function findSelectedTower(selectedTower: Phaser.GameObjects.Sprite): string | null {
  for (const [towerID, tower] of towerState.activeTowers.entries()) {
    if (tower === selectedTower) {
      return towerID;
    }
  }
  return null;
}

function cannotAffordTower (price: number, context: BaseScene): boolean {
  if (!playerState.buyTower(price)) {
    console.log('cannnot afford');
    context.isPlacingTower = false;
    return true;
  } else {
    return false;
  }
};

function createTowerRangeDisplay(tower: any, range: number, context: BaseScene) {
  console.log(range);
  const rangeDisplay = context.add.circle(tower.x, tower.y, range, 0xffffff, 0.1);
  rangeDisplay.setOrigin(0.5);
  return rangeDisplay
}

function updateTowerRangeDisplay(rangeDisplay: Phaser.GameObjects.Arc, range: number, tower: any) {
  rangeDisplay.setPosition(tower.x, tower.y);
  rangeDisplay.setRadius(range);
}

export {
  attachTowerSelection,
  findSelectedTower,
  cannotAffordTower,
  createTowerRangeDisplay,
  updateTowerRangeDisplay,
};