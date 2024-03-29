import Phaser from "phaser";

const createFaunaAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  anims.create({
  key: 'fauna-idle-down',
  frames: [{ key: 'fauna', frame: 'walk-down-3.png'}]
})

anims.create({
  key: 'fauna-idle-up',
  frames: [{ key: 'fauna', frame: 'walk-up-3.png'}]
})

anims.create({
  key: 'fauna-idle-side',
  frames: [{ key: 'fauna', frame: 'walk-side-3.png'}]
})


// Running

anims.create({
  key: 'fauna-run-down',
  frames: anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
  repeat: -1,
  frameRate: 13
})


anims.create({
  key: 'fauna-run-up',
  frames: anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
  repeat: -1,
  frameRate: 13
})

anims.create({
  key: 'fauna-run-side',
  frames: anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
  repeat: -1,
  frameRate: 13
})

// fainting

anims.create({
  key: 'fauna-faint',
  frames: anims.generateFrameNames('fauna', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
  frameRate: 13
})


}

export {
  createFaunaAnims
}