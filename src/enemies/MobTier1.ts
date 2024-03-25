import Phaser from "phaser";
import { playerState } from "../states/PlayerState";
import { mobStore} from "../states/MobStore";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mob_t1(x: number, y: number, texture: string, frame?: string): MobTier1
    }
  }
}

export default class MobTier1 extends Phaser.Physics.Arcade.Sprite {

  // For health state
  accessor health: number = 100;
  // private speed: number = 200;
  
  // for currency state
  value: number = 100;
  speed: number = 50;
  
  private hasEnteredEndpoint: boolean = false;

  // For path state
  private movePath: Phaser.Math.Vector2[] = []
  private moveToTarget?: Phaser.Math.Vector2
 
  // For Anims
  runFrame: string;
  deathFrame: string;


  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string ) {

    super(scene, x, y, texture, frame); 
    scene.physics.world.enable(this);
    this.runFrame = 'mob_t1_run';
    this.deathFrame = 'mob_t1_death'
    this.anims.play(this.runFrame);


  };

  moveAlong(path: Phaser.Math.Vector2[]) {
    if (!path || path.length <= 0) {
        return
    }

    this.movePath = path
    this.moveTo(this.movePath.shift()!);
}

moveTo(target: Phaser.Math.Vector2) {
    this.moveToTarget = target
}

update() {
  
  // If dead no movement updates
  if (this.health <= 0) {
    return;
  };

  let dx = -1
  let dy = 0

  if (this.moveToTarget) {
    dx = this.moveToTarget.x - this.x
    dy = this.moveToTarget.y - this.y

    if (Math.abs(dx) < 5) {
      dx = 0
    }
    if (Math.abs(dy) < 5) {
      dy = 0
    }

    if (dx === 0 && dy === 0) {
      if (this.movePath.length > 0) {
        this.moveTo(this.movePath.shift()!)
        return
      }

      this.moveToTarget = undefined
    };
  };

  const leftDown = dx < 0
  const rightDown = dx > 0
  const upDown = dy < 0
  const downDown = dy > 0


  if (!this.anims.currentAnim){
    throw new Error('No anims!')
  }

  if (leftDown) {
    this.anims.play(this.runFrame, true)
    this.setVelocity(-this.speed, 0)

    this.flipX = true
  } else if (rightDown) {
    this.anims.play(this.runFrame, true)
    this.setVelocity(this.speed, 0)

    this.flipX = false
  } else if (upDown) {
    this.anims.play(this.runFrame, true)
    this.setVelocity(0, -this.speed)
  } else if (downDown) {
    this.anims.play(this.runFrame, true)
    this.setVelocity(0, this.speed)
  } else {
    const parts = this.anims.currentAnim.key.split('-')
    parts[1] = 'idle'
    this.anims.play(parts.join('-'))
    this.setVelocity(0, 0)
  };
};


  protected preUpdate(t: number, dt: number){
    super.preUpdate(t, dt);
  };

  decreaseHealth(amount: number, id: string, scene: Phaser.Scene) {
    if (this.health <= 0) {
      // Spider bot is already dead, no need to apply further changes
      return;
    };
    this.health -= amount;

    // if not dead do the tint or kill it 
    if (this.health > 0) {
      const hitSFX = this.scene.sound.add('mob_hit');
      hitSFX.play( { volume: 0.5 });
      this.setTint(0xff0000);
      scene.time.delayedCall(400, () => {
        this.clearTint(); // Revert the tint back to its original color after 0.4 seconds
      });
    };

    // Remove mob object if health is zero
    if (this.health <= 0) {
      // this.setVelocity(0, 0);
      // this.setTint(0xff0000);
      if (!this.body){
        throw new Error('No body to remove health');
      };

      this.body.enable = false; 
      this.anims.stop();
      this.anims.play(this.deathFrame);

      // Allow time to play animation before destroy
      scene.time.delayedCall(1000, () => {
        const mobDeathSFX = this.scene.sound.add('mob_death');
        mobDeathSFX.play();
        // if it died while in end zone no funds
        if (!this.hasEnteredEndpoint) {
          playerState.addFunds(this.value);
        };
        this.destroy();
        mobStore.removeMob(id);
      });
    };
  };

  checkEndPoint(endPointX: number, endPointY: number): boolean {
    // Check if mob crosses the end point
    const tolerance = 7; // Will allow for a small difference in range, difficult to get exact position coord, adjust accordingly
    if ((Math.abs(this.x - endPointX) <= tolerance && Math.abs(this.y - endPointY) <= tolerance) && !this.hasEnteredEndpoint)  {
      this.hasEnteredEndpoint= true;
      // console.log('mob has entered endpoint');
      return true; // Mob has reached the end
    } else {
      return false; 
    };
  };
};

// Add Mob t1 to game object Factory
Phaser.GameObjects.GameObjectFactory.register('mob_t1', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string) {
  const sprite = new MobTier1(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});