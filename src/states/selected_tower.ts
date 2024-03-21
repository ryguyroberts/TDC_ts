import { makeAutoObservable } from "mobx";

class SelectedTowerState {
  selectedTower: Phaser.GameObjects.Sprite | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }

  selectTower(tower: Phaser.GameObjects.Sprite) {
    this.selectedTower = tower;
  }

  deselectTower() {
    this.selectedTower = null;
  }

  displayInfo() {
    
  }
}

const selectedTowerState = new SelectedTowerState();

export default selectedTowerState;