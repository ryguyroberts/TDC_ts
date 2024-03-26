import Phaser from "phaser";

const createMobTier4Anims = (anims: Phaser.Animations.AnimationManager) => {

  if (!anims.exists('mob_t4_run')) {
    anims.create({
      key: 'mob_t4_run',
      frames: anims.generateFrameNames('mob_t4', { start: 1, end: 4, prefix: 'mob_t4/run/0', suffix: '.png' }),
      repeat: -1,
      frameRate: 8
    });
  };

  anims.create({
    key: 'mob_t4_die',
    frames: anims.generateFrameNames('mob_t4', { start: 1, end: 8, prefix: 'mob_t4/die/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8
  })
};

export {
  createMobTier4Anims
};