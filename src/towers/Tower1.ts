import Phaser from "phaser";
import MobTier1 from "../enemies/MobTier1";
import { mobStore } from "../states/MobStore";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      tower1(x: number, y: number, texture: string, frame?: string | number): Tower1
    }
  }
}

export default class Tower1 extends Phaser.Physics.Arcade.Sprite {
  private shootRange: number;
  private shootTime: number;
  private shootDelay: number;
  private mobGroup!: Phaser.Physics.Arcade.Group
  private attackDmg: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);
    this.setScale(0.50);

    this.anims.play('tower-idle');

    // properties for projectiles
    this.shootRange = 100;
    this.shootTime = 2;
    this.shootDelay  = 1000;
    this.attackDmg = 20;
  };

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);


    this.mobGroup = (this.scene as any).mobGroup
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
    // Create sprite and shoot towards the target (mob)
    const projectile = this.scene.add.sprite(this.x, this.y, 'fauna');
    this.scene.physics.add.existing(projectile);

    // Function to continuously check the distance between the projectile and the target
    const checkDistance = () => {
      if (target && Phaser.Math.Distance.Between(projectile.x, projectile.y, target.x, target.y) < 10) {
        projectile.destroy();

        if (target instanceof MobTier1) { // Ensure target is MobTier1
          (target as MobTier1).decreaseHealth(this.attackDmg, target.getData('id'), this.scene); // Cast target to MobTier1 and call decreaseHealth
          mobStore.updateMobHealth(target.getData('id'), target.health);
        }
        // another if here? for mobtier
      } else {
        this.scene.physics.moveToObject(projectile, target, 200);
        this.scene.time.delayedCall(100, checkDistance);
      }
    };

    checkDistance();
  }
  }

Phaser.GameObjects.GameObjectFactory.register('tower1', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Tower1(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});