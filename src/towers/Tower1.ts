import Phaser from "phaser";

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

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);
    this.setScale(0.50);

    this.anims.play('tower-idle');

    // properties for projectiles
    this.shootRange = 100;
    this.shootTime = 2;
    this.shootDelay  = 100;
  };

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    const fauna = (this.scene as any).fauna
    this.detectAndShoot(fauna);

  }
  
  detectAndShoot(fauna: Phaser.GameObjects.Sprite) {
    if (!fauna) {
      return;
    };

    // Between tower and Fauna
    const distance = Phaser.Math.Distance.Between(this.x, this.y, fauna.x, fauna.y);

    if (distance <= this.shootRange && this.scene.time.now > this.shootTime) {
      this.shoot(fauna);
      this.shootTime = this.scene.time.now + this.shootDelay;
    };

  }

  shoot(target: Phaser.GameObjects.Sprite) {
    // Create sprite and shoot towards the target (fauna)
    const projectile = this.scene.add.sprite(this.x, this.y, 'fauna');
    this.scene.physics.add.existing(projectile);

    // Function to continuously check the distance between the projectile and the target
    const checkDistance = () => {
        if (target && Phaser.Math.Distance.Between(projectile.x, projectile.y, target.x, target.y) < 10) {
            projectile.destroy();
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