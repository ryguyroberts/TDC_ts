import { makeAutoObservable } from "mobx";

class SelectedTowerState {
  selectedTower: Phaser.GameObjects.Sprite | null = null;
  previousTowerRangeDisplay: Phaser.GameObjects.Arc | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }

  selectTower(tower: Phaser.GameObjects.Sprite) {
    this.selectedTower = tower;
  }

  deselectTower() {
    this.selectedTower = null;
  }

  setPreviousTowerRangeDisplay(rangeDisplay: Phaser.GameObjects.Arc | null) {
    this.previousTowerRangeDisplay = rangeDisplay;
  }
}

const selectedTowerState = new SelectedTowerState();

export default selectedTowerState;