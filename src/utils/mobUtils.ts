// import Phaser from "phaser";
import { mobStore } from "../states/MobStore";
import { gamephase } from "../states/GamePhase";


// if mobx state has no mobs (all dead) enter build stage
const checkEndCombat = () => {
  const mobEntries = Array.from(mobStore.mobs.entries());
  if (mobEntries.length === 0) {
    // If there are no mobs left, transition to the build phase
    gamephase.stage = 'build';
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
}

export {
  checkEndCombat,
  createMobTier2,
  createMobTier1
};