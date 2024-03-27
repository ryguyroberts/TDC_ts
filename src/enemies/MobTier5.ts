import Phaser from "phaser";

import MobTier1 from "./MobTier1";

// for typeScript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t5(x: number, y: number, texture: string, frame?: string | number): MobTier5
    }
  }
}

export default class MobTier5 extends MobTier1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame);

    this.setScale(1.5);
    this.runFrame = 'mob_t5_run';
    this.deathFrame = 'mob_t5_die';
    this.speed = 50;
    this.health = 2500;
  };

};

// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t5', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string) {
  const sprite = new MobTier5(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});