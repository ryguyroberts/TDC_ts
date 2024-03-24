import { makeAutoObservable, action } from "mobx";

class GamePhase {
  wave: number = 1;
  stage: string = 'build'; 
  buildtime: number = 60;
  combatPhaseStarted: boolean = false;

  constructor() {
    makeAutoObservable(this);
  };
 
  toggleStage() {
    this.stage = this.stage === 'build' ? 'combat' : (this.stage === 'combat' ? 'build' : 'game_end');
    console.log('stage', this.stage);
  };

  reset() {
    this.wave = 1;
    this.stage = 'build';
    this.buildtime = 60;
    this.combatPhaseStarted = false;
  }

  @action
  updateTimerAction() {
    this.buildtime--;
    // console.log(this.buildtime);
  }

};



export const gamephase = new GamePhase();