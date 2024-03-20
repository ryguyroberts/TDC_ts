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

  private movePath: Phaser.Math.Vector2[] = []
  private moveToTarget?: Phaser.Math.Vector2

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
      super(scene, x, y, texture, frame)

      this.anims.play('fauna-idle-down')
  }

  moveAlong(path: Phaser.Math.Vector2[]) {
      if (!path || path.length <= 0) {
          return
      }

      this.movePath = path
      this.moveTo(this.movePath.shift()!)
  }

  moveTo(target: Phaser.Math.Vector2) {
      this.moveToTarget = target
  }

  update() {
    
      let dx = 0
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
          }
      }

      const leftDown = dx < 0
      const rightDown = dx > 0
      const upDown = dy < 0
      const downDown = dy > 0

      const speed = 100

      if (leftDown) {
          this.anims.play('fauna-run-side', true)
          this.setVelocity(-speed, 0)

          this.flipX = true
      } else if (rightDown) {
          this.anims.play('fauna-run-side', true)
          this.setVelocity(speed, 0)

          this.flipX = false
      } else if (upDown) {
          this.anims.play('fauna-run-up', true)
          this.setVelocity(0, -speed)
      } else if (downDown) {
          this.anims.play('fauna-run-down', true)
          this.setVelocity(0, speed)
      } else {
          const parts = this.anims.currentAnim.key.split('-')
          parts[1] = 'idle'
          this.anims.play(parts.join('-'))
          this.setVelocity(0, 0)
      }
  }
}

Phaser.GameObjects.GameObjectFactory.register('fauna', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  var sprite = new Fauna(this.scene, x, y, texture, frame)

  this.displayList.add(sprite)
  this.updateList.add(sprite)

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

  return sprite
})