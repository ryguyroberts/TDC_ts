import Phaser from "phaser";

const createGreenProjectAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Idles
  anims.create({
  key: 'green-proj',
  frames: [{ key: 'green_project', frame: 'shoot/00.png'}]
})

};

export {
  createGreenProjectAnims
};