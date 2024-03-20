import { makeAutoObservable } from "mobx";
import Tower1 from "../towers/Tower1";

class TowerState {
  activeTowers: Map<string, Tower1> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  addTower(id: string, tower: Tower1) {
    this.activeTowers.set(id, tower);
  }

  removeTower(id: string) {
    this.activeTowers.delete(id);
  }

  getTower(id: string) {
    return this.activeTowers.get(id);
  }
};

export const towerState = new TowerState();

