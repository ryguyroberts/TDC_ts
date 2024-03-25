import { makeAutoObservable, action } from "mobx";

class GamePhase {
  wave: number = 1;
  stage: string;
  buildtime: number;
  // combatPhaseStarted: boolean = false;
  timer: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  };
 
  // toggleStage() {
  //   //
  //   // this.stage = this.stage === 'build' ? 'combat' : (this.stage === 'combat' ? 'build' : 'game_end');
  //   this.stage = this.stage === 'build' ? 'combat' : 'build';
  //   console.log('stage', this.stage);
  // };

  reset() {
    this.wave = 1;
    this.setStage('build1');
    this.clearTimer;
    // this.combatPhaseStarted = false;
    console.log('set stage to build in reset');
  }


  @action
  startTimerAction = (): void => {
    // Clear previous interval if exists
    if (this.timer) clearInterval(this.timer);

    // Start a new interval
    this.timer = setInterval(() => {
      if (this.buildtime > 0) {
        this.decrementBuildTime(); // Decrement buildtime
      } else {
        // If buildtime reaches 0, clear the interval
        this.clearTimer;
        this.setStage('combat');
      }
    }, 1000);
  };

  @action
  decrementBuildTime = (): void => {
    this.buildtime--;
  };

  @action
  setStage = (stage: string) => {
    this.stage = stage;
  }

  @action
  clearTimer = (): void => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
};



export const gamephase = new GamePhase();