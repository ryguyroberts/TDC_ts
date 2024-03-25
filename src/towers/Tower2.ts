import Phaser from "phaser";
import Tower1 from "./Tower1";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      tower2(x: number, y: number, texture: string, frame?: string | number): Tower2;
    }
  }
}

 export default class Tower2 extends Tower1 {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    
    this.setScale(2);
  }
 }

 Phaser.GameObjects.GameObjectFactory.register('tower2', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  const sprite = new Tower2(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});
