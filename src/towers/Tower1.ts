import Phaser from "phaser";
import MobTier1 from "../enemies/MobTier1";
import { mobStore } from "../states/MobStore";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      tower1(x: number, y: number, texture: string, frame?: string | number): Tower1;
    }
  }
}

export default class Tower1 extends Phaser.Physics.Arcade.Sprite {
  private shootRange: number;
  private shootTime: number;
  private shootDelay: number;
  private mobGroup!: Phaser.Physics.Arcade.Group;
  private attackDmg: number;
  private projectiles: Phaser.GameObjects.Sprite[] = [];
  placed: boolean = false;
  price: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);

    this.anims.play('t1_idle');

    this.setScale(2.0)
    this.setDepth(50);

    if (!this.body) {
      throw new Error('no physics body');
    }
    this.body.setSize(16, 16);

    // price of tower
    this.price = 100;

    // properties for projectiles
    this.shootRange = 1000;
    // No idea shoot time?
    this.shootTime = 2; // Time to reach mob?
    this.shootDelay = 500;
    this.attackDmg = 5;
  };

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    if (!this.placed) {
      return; // if not placed, exit preUpdate
    }

    this.mobGroup = (this.scene as any).mobGroup;
    // Get all mobs in the mob group - use mobstore instead??
    const mobs = this.mobGroup.getChildren() as Phaser.Physics.Arcade.Sprite[];

    let closestMob: Phaser.Physics.Arcade.Sprite | null = null;
    let closestDistance = Infinity;

    mobs.forEach((mob: Phaser.Physics.Arcade.Sprite) => {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, mob.x, mob.y);
    

      if (distance < closestDistance) {
        closestMob = mob;
        closestDistance = distance;
      }
    });

    if (closestMob && closestDistance <= this.shootRange && this.scene.time.now > this.shootTime) {
      this.shoot(closestMob);
      this.shootTime = this.scene.time.now + this.shootDelay;
    }

  }

  shoot(target: Phaser.Physics.Arcade.Sprite) {
    // SFX 
    const laserSFX = this.scene.sound.add('tower_laser');
    laserSFX.play({ volume: 0.05 });
    
    // Create sprite and shoot towards the target (mob)
    const projectile = this.scene.add.sprite(this.x, this.y, 'green_project');
    projectile.setDepth(50);
    this.scene.physics.add.existing(projectile);
    this.projectiles.push(projectile)

    // Function to continuously check the distance between the projectile and the target
    const checkDistance = () => {
      // Destory tower's created projectiles when a tower is being deleted
      if (!this.placed) { 
        this.destroyProjectiles();
        return
      }

      if (target && Phaser.Math.Distance.Between(projectile.x, projectile.y, target.x, target.y) < 10) {
        projectile.destroy();

        if (target instanceof MobTier1) { // Ensure target is MobTier1
          (target as MobTier1).decreaseHealth(this.attackDmg, target.getData('id'), this.scene); // Cast target to MobTier1 and call decreaseHealth
          mobStore.updateMobHealth(target.getData('id'), target.health);
        }
        // another if here? for mobtier
      } else {
        this.scene.physics.moveToObject(projectile, target, 200); // Speed of the projectile?
        this.scene.time.delayedCall(100, checkDistance);
      }
    };

    checkDistance();
  }

  stopFiring() {
    this.shootTime = 0;
  }

  destroyProjectiles() {
    this.projectiles.forEach(projectile => {
      if (projectile) {
        projectile.destroy();
      }
    });
    this.projectiles = [];
  }
}

Phaser.GameObjects.GameObjectFactory.register('tower1', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Tower1(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});