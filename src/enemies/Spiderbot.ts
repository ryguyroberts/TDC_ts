import Phaser from "phaser";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      spiderbot(x: number, y: number, texture: string, frame?: string | number): Spiderbot
    }
  }
}

export default class Spiderbot extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);

   
    this.anims.play('spiderbot_run');

  };

  protected preUpdate(t: number, dt: number){
    super.preUpdate(t, dt);
    this.setVelocityX(50);

  }
};


// Add Fauna to game object Factory
Phaser.GameObjects.GameObjectFactory.register('spiderbot', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Spiderbot(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});