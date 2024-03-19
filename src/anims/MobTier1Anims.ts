import Phaser from "phaser";

const createMobTier1Anims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  
anims.create({
  key: 'mob_t1_idle',
  frames: anims.generateFrameNames('mob_t1', { start: 1, end: 4, prefix: 'idle/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8
})

anims.create({
  key: 'mob_t1_run',
  frames: anims.generateFrameNames('mob_t1', { start: 1, end: 4, prefix: 'run/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8
})

anims.create({
  key: 'mob_t1_death',
  frames: anims.generateFrameNames('mob_t1', { start: 0, end: 6, prefix: 'die/0', suffix: '.png' }),
  repeat: 0,
  frameRate: 8

})

};

export {
  createMobTier1Anims
};