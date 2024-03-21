// import Phaser from "phaser";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";



const checkEndCombat = () => {
  const mobEntries = Array.from(mobStore.mobs.entries());
  if (mobEntries.length === 0) {
    // If there are no mobs left, transition to the build phase
    gamephase.stage = 'build';
  };
};


export {
  checkEndCombat,
};