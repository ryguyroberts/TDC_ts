import Phaser from "phaser";
import { playerState } from "../states/PlayerState";
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
  private speed: number = 200;
  
  // for currency state
  value: number = 100;

  private hasEnteredEndpoint: boolean = false;
 

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);
    this.anims.play('mob_t1_run');
    this.setDepth(100);
   
  };


  protected preUpdate(t: number, dt: number){
    super.preUpdate(t, dt);
    this.setVelocityX(this.speed);
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

    // Remove mob object if health is zero
    if (this.health <= 0) {
      // this.speed = 0;
      // this.setTint(0xff0000);
      if (!this.body){
        throw new Error('No body to remove health');
      }

      this.body.enable = false; 
      this.anims.stop();
      this.anims.play('mob_t1_death');

      // Allow time to play animation before destroy
      scene.time.delayedCall(1000, () => {
        playerState.addFunds(this.value);
        this.destroy();
        mobStore.removeMob(id);
      });
    }
  }

  checkEndPoint(endPointX: number, endPointY: number): boolean {
    // Check if mob crosses the end point
    const tolerance = 0.5; // Will allow for a small difference in range, difficult to get exact position coord, adjust accordingly
    if ((Math.abs(this.x - endPointX) <= tolerance && Math.abs(this.y - endPointY) <= tolerance) && !this.hasEnteredEndpoint)  {
      this.hasEnteredEndpoint= true;
      console.log(this.hasEnteredEndpoint);
      console.log('set end point true');
      return true; // Mob has reached the end
    } else {
      return false; 
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