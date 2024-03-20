import Phaser from "phaser";
import { mobStore} from "../states/MobStore";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t1(x: number, y: number, texture: string, frame?: string | number): MobTier1
    }
  }
}

export default class MobTier1 extends Phaser.Physics.Arcade.Sprite {

  // For health state
  accessor health: number = 100;
  private speed: number = 50;
 

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);
    this.anims.play('mob_t1_run');
    this.setDepth(100);
   
  };


  protected preUpdate(t: number, dt: number){
    super.preUpdate(t, dt);
    this.setVelocityY(this.speed);
  }

  decreaseHealth(amount: number, id: string, scene: Phaser.Scene) {
    if (this.health <= 0) {
      // Spider bot is already dead, no need to apply further changes
      return;
    }
    this.health -= amount;

    // if not dead do the tint or kill it 
    if (this.health > 0) {
      this.setTint(0xff0000);
      scene.time.delayedCall(500, () => {
        this.clearTint(); // Revert the tint back to its original color after 0.5 seconds
      });
    } 

    // Remove spider object if health is zero
    if (this.health <= 0) {
      this.speed = 0;
      this.setTint(0xff0000);
      this.anims.play('mob_t1_death');

      // Allow time to play animation before destroy
      scene.time.delayedCall(1000, () => {
        this.destroy();
        mobStore.removeMob(id);
      });
    }
  }
};


// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t1', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new MobTier1(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});