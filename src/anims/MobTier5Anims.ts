import Phaser from "phaser";

const createMobTier5Anims = (anims: Phaser.Animations.AnimationManager) => {

  if (!anims.exists('mob_t5_run')) {
    anims.create({
      key: 'mob_t5_run',
      frames: anims.generateFrameNames('mob_t5', { start: 1, end: 8, prefix: 'mob_t5/run/0', suffix: '.png' }),
      repeat: -1,
      frameRate: 8
    });
  };

  anims.create({
    key: 'mob_t5_die',
    frames: anims.generateFrameNames('mob_t5', { start: 1, end: 9, prefix: 'mob_t5/die/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8
  })
};

export {
  createMobTier5Anims
};