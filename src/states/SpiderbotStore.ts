import { makeAutoObservable } from "mobx";
import Spiderbot from "../enemies/Spiderbot";

class SpiderbotStore {
  spiderbots: Map<string, Spiderbot> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  addSpiderbot(id: string, spiderbot: Spiderbot) {
    this.spiderbots.set(id, spiderbot);
  }

  removeSpiderbot(id: string) {
    this.spiderbots.delete(id);
  }

  getSpiderbot(id: string) {
    return this.spiderbots.get(id);
  }

  logSpiderbots() {
    // Convert map to array and log it
    console.log(Array.from(this.spiderbots.entries()));
  }

  updateSpiderbotHealth(id: string, newHealth: number) {
    const spiderbot = this.spiderbots.get(id);
    if (spiderbot) {
      spiderbot.health = newHealth;
    }
  }

};

export const spiderbotStore = new SpiderbotStore();