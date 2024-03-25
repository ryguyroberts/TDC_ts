import Phaser from "phaser";
import Tower1 from "./Tower1";
// For typescript
declare global {

  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      tower3(x: number, y: number, texture: string, frame?: string | number): Tower3;
    }
  }
};

// Sniper Tower Long Range lots of dmg
export default class Tower3 extends Tower1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {    
    super(scene, x, y, texture, frame);

    this.setTint(0x0F82E2)
    this.shootRange = 450;
    this.shootTime = 1;
    this.shootDelay = 2500;
    this.projectileSpeed = 400;
    this.projectTint= 0x0F82E2;
    this.projectSize= 3.0;
    this.attackDmg = 25;
  };
};


Phaser.GameObjects.GameObjectFactory.register('tower3', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Tower3(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});