import { makeAutoObservable } from "mobx";
import Tower1 from "../towers/Tower1";

class TowerState {
  activeTowers: Map<string, Tower1> = new Map();
  towerLayer: string[];


  constructor() {
    makeAutoObservable(this);
  }

  addTower(id: string, tower: Tower1) {
    this.activeTowers.set(id, tower);
    // console.log("active towers", this.activeTowers)
  
  }

  removeTower(id: string) {
    this.activeTowers.delete(id);
  }

  getTower(id: string) {
    return this.activeTowers.get(id);
  }
  
  reset(): void {
    this.activeTowers.clear();
    this.towerLayer = [];
  }

  setTowerLayer(towerLayer: string[]) {
    this.towerLayer = towerLayer;
  }


};

export const towerState = new TowerState();