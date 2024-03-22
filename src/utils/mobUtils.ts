// import Phaser from "phaser";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";

// The interfaces are coming

interface MainGame extends Phaser.Scene {
  mobSpawnEvent?: Phaser.Time.TimerEvent;
  buildPhaseEvent?: Phaser.Time.TimerEvent;
  buildPhaseEndEv?: Phaser.Time.TimerEvent;
}

//->> Build Phase Logic <<-//
const startBuildPhase = (scene: MainGame) => {

  // If for some reason mobs are still spawning stop it
  if (scene.mobSpawnEvent) {
    scene.mobSpawnEvent.remove(false)
  };

  // Probably a better way to do this
  gamephase.buildtime = 60;

     // Set a timed event to update build time every second
     scene.buildPhaseEvent = scene.time.addEvent({
      delay: 1000, // Delay of 1 second
      callback: () => {
        updateTimer();
      },
      callbackScope: this,
      loop: true // Set loop to true to repeat the event
    });

    const buildTime = 60;

    scene.buildPhaseEndEv = scene.time.addEvent({
      delay: buildTime * 1000, // Convert seconds to milliseconds
      callback: endBuild,
      callbackScope: scene
    });

    scene.time.addEvent({
      delay: 1000, // Convert seconds to milliseconds
      callback: updateTimer,
      callbackScope: this
    });
};

// Runs at the end of the build phase
const endBuild = () => {
  console.log('end build stage');
  gamephase.toggleStage();
}

// Just inrecements timer
const updateTimer = () => {
  // increment by 1 for now
  gamephase.updateTimerAction();
};  


// if mobx state has no mobs (all dead) enter build stage
const checkEndCombat = () => {
  const mobEntries = Array.from(mobStore.mobs.entries());
  if (mobEntries.length === 0) {
    // If there are no mobs left, transition to the build phase
    gamephase.stage = 'build';
  };
};


//->> Combat Phase Logic <<-//
const startCombatPhase = (scene: MainGame, mobGroup: Phaser.Physics.Arcade.Group) => {
  console.log('Combat Phase started');
  const numberOfMobsToSpawn = 30; // Adjust this number as needed
  const spawnDelay = 1000; // Adjust this delay (in milliseconds) as needed

  spawnMobsWithDelay(scene , mobGroup, numberOfMobsToSpawn, spawnDelay)

};


const spawnMobsWithDelay = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group, count: number, spawnDelay: number) => {
  if (count >= 0 ) {
    // Spawn a mob
    createMobRandom(scene, mobGroup);
    console.log('suppose to make a mob');
    scene.time.delayedCall(spawnDelay, spawnMobsWithDelay, [scene, mobGroup, count - 1, spawnDelay]);
  };
};

//curent mob spawn method which is just random.
const createMobRandom = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group) => {
  const randomMobType = Phaser.Math.RND.between(1, 2);

  if (randomMobType === 1) {
    createMobTier1(scene, mobGroup);
    // console.log('num of mobs in the mobGroup', this.mobGroup.getLength());
  } else {
    // console.log('made a mob2');
    createMobTier2(scene, mobGroup);
    // console.log('num of mobs in the mobGroup', this.mobGroup.getLength());
  };

};

// Generate MobTier1 Make it dryer SON
const createMobTier1 = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group) => {
  const mob_t1 = scene.add.mob_t1(448, 0, 'mob_t1');
  // Add properties
  const mobID = Phaser.Math.RND.uuid();
  mob_t1.setData('id', mobID);

  // Add to physics system and collider
  // this.physics.add.existing(mob_t1);
  //this.physics.add.collider(mob_t1, this.wallsLayer); 

  // Add to mob group and MobStore why both Ryan?
  mobGroup.add(mob_t1);
  mobStore.addMob(mobID, mob_t1);
};



// Generate MobTier2
const createMobTier2 = (scene: Phaser.Scene, mobGroup: Phaser.Physics.Arcade.Group) => {
  const mob_t2 = scene.add.mob_t2(448, 0, 'mob_t1');
  // Add properties
  const mobID = Phaser.Math.RND.uuid();
  mob_t2.setData('id', mobID);

  // Add to physics system and collider
  // this.physics.add.existing(mob_t2);
  //this.physics.add.collider(mob_t2, this.wallsLayer); 

  // Add to mob group and MobStore
  mobGroup.add(mob_t2);
  mobStore.addMob(mobID, mob_t2);
};

export {
  checkEndCombat,
  createMobRandom,
  startBuildPhase,
  startCombatPhase
};