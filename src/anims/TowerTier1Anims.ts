
import Phaser from "phaser";

const createTowerTier1Anims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  anims.create({
  key: 't1_idle',
  frames: anims.generateFrameNames('tower_t1', { start: 0, end: 3, prefix: 'idle/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8
  });



} ;

export {
  createTowerTier1Anims
}