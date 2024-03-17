import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  };

  preload() {
    // Map

    // Sprites

    // UI

  }

  // Once asset all preloaded start our game! (Our main menu here)

  create() {
    this.scene.start('game');
  };

};