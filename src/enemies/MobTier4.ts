import Phaser from "phaser";

import MobTier1 from "./MobTier1";

// for typeScript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t4(x: number, y: number, texture: string, frame?: string | number): MobTier4
    }
  }
}

export default class MobTier4 extends MobTier1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame);

    this.health = 1000; 
    this.speed = 75;
    this.runFrame = 'mob_t4_run';
    this.deathFrame = 'mob_t4_die';


  };

};

// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t4', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string) {
  const sprite = new MobTier4(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});