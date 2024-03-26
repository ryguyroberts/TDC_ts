import Phaser from "phaser";
import Tower1 from "./Tower1";
// For typescript
declare global {

  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      tower2(x: number, y: number, texture: string, frame?: string | number): Tower2;
    }
  }
};

// Machine Gun tower - Fast bullet shots
export default class Tower2 extends Tower1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {    
    super(scene, x, y, texture, frame);

    this.setTint(0xFF7800)
    this.shootRange = 175;
    this.shootTime = 0.5;
    this.shootDelay = 100;
    this.projectileSpeed = 200;
    this.projectTint= 0xFF9300;
    this.projectSize= 0.75;
    this.attackDmg = 1;

  };
};


Phaser.GameObjects.GameObjectFactory.register('tower2', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Tower2(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});