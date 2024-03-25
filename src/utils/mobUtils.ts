// import Phaser from "phaser";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";
import MobTier1 from "../enemies/MobTier1";
// import MobTier2 from "../enemies/MobTier2";
// import MobTier3 from "../enemies/MobTier3";
// import MobTier4 from "../enemies/MobTier4";
// import MobTier5 from "../enemies/MobTier5";

// The interfaces are coming

interface MainGame extends Phaser.Scene {
  mobSpawnEvent?: Phaser.Time.TimerEvent;
}

//->> The Phase Controller <<-//
const dynamicPhase = (scene: MainGame, mobGroup: Phaser.Physics.Arcade.Group) => {
  if (gamephase.stage === 'build' || gamephase.stage === 'build1') {
    // Do build phase stuff 
    startBuildPhase(scene);
    console.log(' Set stage to build in Dynamin phase');

  } else if (gamephase.stage === 'combat') {
    // Do combat phase stuff
    startCombatPhase(scene, mobGroup, gamephase.wave);
  };
};


//->> Build Phase Logic <<-//
const startBuildPhase = (scene: MainGame) => {

  // If for some reason mobs are still spawning stop it
  if (scene.mobSpawnEvent) {
    scene.mobSpawnEvent.remove(false)
  };
  // gamephase.combatPhaseStarted = false;

  // Set Buildtime, start timer in Mobx (dynamic)
  gamephase.buildtime = 60;
  gamephase.startTimerAction();
};


//->> Combat Phase Logic <<-//
// Wave configurations Set by us
const waveConfigurations: { tier1: number, tier2: number, tier3: number, tier4: number, tier5: number }[] = [
  { tier1: 1, tier2: 1, tier3: 1, tier4: 1, tier5: 1}, // Wave 1
  { tier1: 40, tier2: 20, tier3: 0, tier4: 0, tier5: 0}, // Wave 2
  { tier1: 80, tier2: 40, tier3: 0, tier4: 0, tier5: 0}, // Wave 3
  { tier1: 160, tier2: 80, tier3: 0, tier4: 0, tier5: 0}, // wave 4
  { tier1: 0 , tier2: 200, tier3: 0, tier4: 0, tier5: 0}, //Final Wave
];


const startCombatPhase = (scene: MainGame, mobGroup: Phaser.Physics.Arcade.Group, wave: number) => {
  // if (gamephase.combatPhaseStarted) {
  //   return;
  // }
  console.log(`Combat Phase started - Wave ${wave}`);
  gamephase.clearTimer();

  const waveConfig = waveConfigurations[wave - 1];

  spawnMobsWithDelay(scene, mobGroup, waveConfig);
  // gamephase.combatPhaseStarted = true;
};


const spawnMobsWithDelay = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group, waveConfig: { tier1: number, tier2: number, tier3: number, tier4: number, tier5: number}) => {
  // Array to spawn mobs
  const mobsToSpawn: number[] = [];

  // For loops? what is this 2023
  // Prolly will get DRYer
  // add tier 1 mob amount
  for (let i = 0; i < waveConfig.tier1; i++) {
    mobsToSpawn.push(1);
  };
  //add tier 2 mob amount
  for (let i = 0; i < waveConfig.tier2; i++) {
    mobsToSpawn.push(2);
  };

  for (let i = 0; i < waveConfig.tier3; i++) {
    mobsToSpawn.push(3); 
  };
  
  for (let i = 0; i < waveConfig.tier4; i++) {
    mobsToSpawn.push(4);
  };
  
  for (let i = 0; i < waveConfig.tier5; i++) {
    mobsToSpawn.push(5); 
  };
   
  // Dryer but its QUADRATIC
  // for (const tier in waveConfig) {
  //   const numMobs = waveConfig[tier];
  //   // Add mobs of this tier to the array
  //   for (let i = 0; i < numMobs; i++) {
  //     mobsToSpawn.push(parseInt(tier)); // Convert tier to number
  //   }
  // }


  // Shuffle Array
  Phaser.Utils.Array.Shuffle(mobsToSpawn);

  // Spawn mobs with Delay! Adjust Delay here
  spawnMobs(scene, mobGroup, mobsToSpawn, 1000);
};


const spawnMobs = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group, mobsToSpawn: number[], spawnDelay: number) => {
  if (mobsToSpawn.length > 0) {
    const mobType = mobsToSpawn.shift();
    createMobOrdered(scene, mobGroup, mobType!);
    scene.time.delayedCall(spawnDelay, () => spawnMobs(scene, mobGroup, mobsToSpawn, spawnDelay));
  };
};



//After been randomized create the order
const createMobOrdered = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group, mobType: number) => {
  if (mobType === 1) {
    createMob(scene, mobGroup, 1); // Tier 1 mob
  } else if (mobType === 2) {
    createMob(scene, mobGroup, 2); // Tier 2 mob
  } else if (mobType === 3) {
    createMob(scene, mobGroup, 3); // Tier 3 mob
  } else if (mobType === 4) {
    createMob(scene, mobGroup, 4); // Tier 3 mob
  } else if (mobType === 5) {
    createMob(scene, mobGroup, 5); // Tier 3 mob
  }
};


const createMob = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group, tier: number) => {

  let mobTexture: string;
  let mobFunction: (x: number, y: number, texture: string) => MobTier1;

  // Refactor?
  // Determine which mob texture and creation function to use based on the tier
  switch (tier) {
    case 1:
      mobTexture = 'mob_t1';
      mobFunction = scene.add.mob_t1;
      break;
    case 2:
      mobTexture = 'mob_t1';
      mobFunction = scene.add.mob_t2;
      break;
    case 3:
      mobTexture = 'mob_t3';
      mobFunction = scene.add.mob_t3;
      break;
    case 4:
      mobTexture = 'mob_t4';
      mobFunction = scene.add.mob_t4;
      break;
    case 5:
      mobTexture = 'mob_t5';
      mobFunction = scene.add.mob_t5;
      break;
    default:
      throw new Error(`Unsupported mob tier: ${tier}`);
  };
  
  // Mob creation logic.
  const mob = mobFunction.call(scene.add, 450, 10, mobTexture);

  // Set properties
  const mobID = Phaser.Math.RND.uuid();
  mob.setData('id', mobID);

  // Add to mob group and MobStore
  mobGroup.add(mob);
  mobStore.addMob(mobID, mob);

};



export {
  startBuildPhase,
  dynamicPhase,
};