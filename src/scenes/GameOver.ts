import Phaser, { GameObjects } from "phaser";

export class GameOver extends Phaser.Scene {
  background: GameObjects.Image;
  exitButton: GameObjects.Image;
  tryAgainButton: GameObjects.Image;

  constructor() {
    super('game_over');
  };

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "game_over_scene");
    this.exitButton = this.add.image(1000, 600, "exit");
    this.tryAgainButton = this.add.image(600, 600, "try_again");

    this.exitButton.setInteractive();
    this.tryAgainButton.setInteractive();

    this.exitButton.on('pointerdown', () => {
      this.scene.start('main_menu');
    });

    this.tryAgainButton.on('pointerdown', () => {
      this.scene.start('main_game');
    }) 
  }
}