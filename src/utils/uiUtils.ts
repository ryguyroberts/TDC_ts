import Phaser from "phaser";
import selectedTowerState from "../states/selected_tower";
import { towerState } from "../states/TowerStore";

class BaseScene extends Phaser.Scene {
  clickSFX: Phaser.Sound.BaseSound;
  deleteTower: Phaser.GameObjects.Sprite;
  
  constructor(key: string) {
    super(key);
  }
}

function attachTowerSelection(tower: Phaser.GameObjects.Sprite, context: BaseScene) {
  tower.on('pointerdown', () => {
    // If selected tower is already selected -> Deselect
    if (selectedTowerState.selectedTower === tower) {
      tower.clearTint();
      selectedTowerState.deselectTower();

      // Deactiviate Delete button
      context.deleteTower.setVisible(false);        
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
      context.clickSFX = context.sound.add('click');
      context.clickSFX.play();

      // Display tower info
      context.deleteTower.setVisible(true);
      // context.displayTowerInfo(tower);
    }
  });
}

// function displayTowerInfo(tower: Phaser.GameObjects.Sprite) {
//   console.log(`Tower selected at position (${tower.x}, ${tower.y})`);
// }

function findSelectedTower(selectedTower: Phaser.GameObjects.Sprite): string | null {
  for (const [towerID, tower] of towerState.activeTowers.entries()) {
    if (tower === selectedTower) {
      return towerID;
    }
  }
  return null;
}

export {
  attachTowerSelection,
  findSelectedTower,
}