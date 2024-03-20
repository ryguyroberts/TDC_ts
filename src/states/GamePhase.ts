import { makeAutoObservable } from "mobx";

class GamePhase {
  wave: Number = 0;
  stage: string = 'build'; 

  constructor() {
    makeAutoObservable(this);
  };
 
  toggleStage() {
    this.stage = this.stage === 'build' ? 'combat' : 'build';
  };
};

export const gamephase = new GamePhase();