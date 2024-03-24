
import Phaser from "phaser";

const createTowerTier1Anims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  anims.create({
  key: 't1_idle',
  frames: anims.generateFrameNames('tower_t1', { start: 1, end: 4, prefix: 'tower_t1/idle/0', suffix: '.png' }),
  repeat: -1,
  frameRate: 8,
  });

  
  anims.create({
    key: 't1_shoot_right',
    frames: anims.generateFrameNames('tower_t1', { start: 1, end: 4, prefix: 'tower_t1/shoot-right/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8,
    });
  
  anims.create({
    key: 't1_shoot_left',
    frames: anims.generateFrameNames('tower_t1', { start: 1, end: 4, prefix: 'tower_t1/shoot-left/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8,
    });

  anims.create({
    key: 't1_shoot_up',
    frames: anims.generateFrameNames('tower_t1', { start: 1, end: 4, prefix: 'tower_t1/shoot-up/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8,
    });

  anims.create({
    key: 't1_shoot_down',
    frames: anims.generateFrameNames('tower_t1', { start: 1, end: 4, prefix: 'tower_t1/shoot-down/0', suffix: '.png' }),
    repeat: -1,
    frameRate: 8,
    });
  
} ;

export {
  createTowerTier1Anims
}