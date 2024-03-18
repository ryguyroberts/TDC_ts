
import Phaser from "phaser";

const createTower1Anims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  anims.create({
  key: 'tower-idle',
  frames:[{ key: 'tower1', frame: 'idle/02.png'}]
  });

} ;

export {
  createTower1Anims
}