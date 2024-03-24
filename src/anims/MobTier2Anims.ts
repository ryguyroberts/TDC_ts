import Phaser from "phaser";

const createMobTier2Anims = (anims: Phaser.Animations.AnimationManager) => {

    if (!anims.exists('mob_t2_run')) {
    anims.create({
      key: 'mob_t2_run',
      frames: anims.generateFrameNames('mob_t2', { start: 0, end: 7, prefix: 'run/0', suffix: '.png' }),
      repeat: -1,
      frameRate: 8
    })
  }
}

export {
  createMobTier2Anims
};