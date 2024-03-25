import Phaser from "phaser";

import MobTier1 from "./MobTier1";

// for typeScript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t3(x: number, y: number, texture: string, frame?: string | number): MobTier3
    }
  }
}

export default class MobTier3 extends MobTier1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame);

    this.health = 100;
    // this.speed = 100;

    this.runFrame = 'mob_t3_run';
    this.deathFrame = 'mob_t3_die';


  };

};

// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t3', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string) {
  const sprite = new MobTier3(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});