import { makeAutoObservable } from "mobx";
import MobTier1 from "../enemies/MobTier1";

class MobStore {
  mobs: Map<string, MobTier1> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  addMob(id: string, mob: MobTier1) {
    this.mobs.set(id, mob);
  }

  removeMob(id: string) {
    this.mobs.delete(id);
  }

  getMob(id: string) {
    return this.mobs.get(id);
  }

  logMobs() {
    // Convert map to array and log it
    console.log(Array.from(this.mobs.entries()));
  }

  updateMobHealth(id: string, newHealth: number) {
    const spiderbot = this.mobs.get(id);
    if (spiderbot) {
      spiderbot.health = newHealth;
    }
  }

};

export const mobStore = new MobStore();