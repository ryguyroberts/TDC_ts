import Phaser from "phaser";

// For typescript
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      fauna(x: number, y: number, texture: string, frame?: string | number): Fauna
    }
  }
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

    super(scene, x, y, texture, frame);
    scene.physics.world.enable(this);

    if (!this.body) {
      throw new Error('body no load');
    }
    this.body.setSize(this.width * 0.5, this.height * 0.8);
    this.anims.play('fauna-idle-down');
  };

  update( cursors: Phaser.Types.Input.Keyboard.CursorKeys ) {
    if(!cursors || !this.body || !this.anims.currentAnim) {
      return
    }
    const speed =150

    let velocityX = 0;
    let velocityY = 0;

    
    if (cursors.left?.isDown) {

      this.anims.play('fauna-run-side', true)
      velocityX = -speed;

      this.scaleX = -1
      this.body.offset.x = 24

    } else if (cursors.right?.isDown) {

      this.anims.play('fauna-run-side', true)
      velocityX = speed;

      this.scaleX = 1
      this.body.offset.x = 8

    } else if (cursors.up?.isDown) {

      this.anims.play('fauna-run-up', true)
      velocityY = -speed;

      
    } else if (cursors.down?.isDown) {

      this.anims.play('fauna-run-down', true)
      velocityY = +speed;


    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.anims.play(parts.join('-'))
    }
    this.setVelocity(velocityX, velocityY);
  };

};


// Add Fauna to game object Factory
Phaser.GameObjects.GameObjectFactory.register('fauna', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Fauna(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});