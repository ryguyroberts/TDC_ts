import { makeAutoObservable } from "mobx";
import Spiderbot from "../enemies/Spiderbot";

class SpiderbotStore {
  spiderbots: Map<number, Spiderbot> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  addSpiderbot(id: number, spiderbot: Spiderbot) {
    this.spiderbots.set(id, spiderbot);
  }

  removeSpiderbot(id: number) {
    this.spiderbots.delete(id);
  }

  getSpiderbot(id: number) {
    return this.spiderbots.get(id);
  }



};

export const spiderbotStore = new SpiderbotStore();