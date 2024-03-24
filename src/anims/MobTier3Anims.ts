import Phaser from "phaser";

const createMobTier3Anims = (anims: Phaser.Animations.AnimationManager) => {

  if (!anims.exists('mob_t3_run')) {
    anims.create({
      key: 'mob_t3_run',
      frames: anims.generateFrameNames('mob_t3', { start: 1, end: 4, prefix: 'mob_t3/run/0', suffix: '.png' }),
      repeat: -1,
      frameRate: 8
    });
  };

  anims.create({
    key: 'mob_t3_die',
    frames: anims.generateFrameNames('mob_t3', { start: 1, end: 8, prefix: 'mob_t3/die/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8
  })
};

export {
  createMobTier3Anims
};