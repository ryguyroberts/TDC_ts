import { makeAutoObservable, action } from "mobx";

class GamePhase {
  wave: number = 1;
  stage: string = 'build'; 
  buildtime: number;
  // combatPhaseStarted: boolean = false;
  timer: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  };
 
  toggleStage() {
    //
    // this.stage = this.stage === 'build' ? 'combat' : (this.stage === 'combat' ? 'build' : 'game_end');
    this.stage = this.stage === 'build' ? 'combat' : 'build';
    console.log('stage', this.stage);
  };

  reset() {
    this.wave = 1;
    this.stage = 'build';
    // this.combatPhaseStarted = false;
  }


  @action
  startTimerAction = (): void => {
    // Clear previous interval if exists
    if (this.timer) clearInterval(this.timer);

    // Start a new interval
    this.timer = setInterval(() => {
      if (this.buildtime > 0) {
        this.decrementBuildTime(); // Decrement buildtime
        console.log(this.buildtime);
      } else {
        // If buildtime reaches 0, clear the interval
        this.clearTimer;
      }
    }, 1000);
  };

  @action
  decrementBuildTime = (): void => {
    this.buildtime--;
  };

  @action
  clearTimer = (): void => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
};



export const gamephase = new GamePhase();