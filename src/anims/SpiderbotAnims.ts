import Phaser from "phaser";

const createSpiderbotAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  
anims.create({
  key: 'spiderbot_idle',
  frames: anims.generateFrameNames('spiderbot', { start: 1, end: 4, prefix: 'idle/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8
})

anims.create({
  key: 'spiderbot_run',
  frames: anims.generateFrameNames('spiderbot', { start: 1, end: 4, prefix: 'run/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8
})

anims.create({
  key: 'spiderbot_death',
  frames: anims.generateFrameNames('spiderbot', { start: 0, end: 6, prefix: 'die/0', suffix: '.png' }),
  repeat: 0,
  frameRate: 8

})

};

export {
  createSpiderbotAnims
};