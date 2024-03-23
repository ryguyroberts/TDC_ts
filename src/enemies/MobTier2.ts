import Phaser from "phaser";

import MobTier1 from "./MobTier1";

// for typeScript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t2(x: number, y: number, texture: string, frame?: string | number): MobTier2
    }
  }
}

export default class MobTier2 extends MobTier1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.health = 1000;
       
    this.anims.play('mob_t1_run');
    this.setScale(3.0);

  };

};

// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t2', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new MobTier2(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});