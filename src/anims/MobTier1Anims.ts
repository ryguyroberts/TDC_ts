import Phaser from "phaser";

const createMobTier1Anims = (anims: Phaser.Animations.AnimationManager) => {
  createAnimationIfNotExists(anims, 'mob_t1_idle', 'mob_t1', { start: 1, end: 4, prefix: 'mob_t1/idle/0', suffix: '.png' }, -1, 8);
  createAnimationIfNotExists(anims, 'mob_t1_run', 'mob_t1', { start: 1, end: 4, prefix: 'mob_t1/run/0', suffix: '.png' }, -1, 8);
  createAnimationIfNotExists(anims, 'mob_t1_death', 'mob_t1', { start: 0, end: 6, prefix: 'mob_t1/die/0', suffix: '.png' }, 0, 8);
}

const createAnimationIfNotExists = (
  anims: Phaser.Animations.AnimationManager,
  key: string,
  textureKey: string,
  frameConfig: Phaser.Types.Animations.GenerateFrameNames,
  repeat: number,
  frameRate: number
) => {
  // Check if the animation already exists
  if (!anims.exists(key)) {
    // If it doesn't exist, create the animation
    anims.create({
      key: key,
      frames: anims.generateFrameNames(textureKey, frameConfig),
      repeat: repeat,
      frameRate: frameRate
    });
  }
};

export {
  createMobTier1Anims
};