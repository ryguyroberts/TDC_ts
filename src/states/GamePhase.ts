import { makeAutoObservable, action } from "mobx";

class GamePhase {
  wave: number = 1;
  stage: string = 'build'; 
  buildtime: number = 60;

  constructor() {
    makeAutoObservable(this);
  };
 
  toggleStage() {
    this.stage = this.stage === 'build' ? 'combat' : 'build';
  };

  @action
  updateTimerAction() {
    this.buildtime--;
    // console.log(this.buildtime);
  }

};



export const gamephase = new GamePhase();