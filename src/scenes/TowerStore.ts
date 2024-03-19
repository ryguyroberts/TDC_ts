import { makeAutoObservable } from "mobx";

class TowerState {
  activeTowers: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTower(tower: Phaser.GameObjects.Sprite) {
    this.activeTowers.push(tower);
  }

  removeTower(tower: Phaser.GameObjects.Sprite) {
    const index = this.activeTowers.indexOf(tower);
    if (index !== -1) {
      this.activeTowers.splice(index, 1);
    }
  }
}

const towerState = new TowerState();

export default towerState;

