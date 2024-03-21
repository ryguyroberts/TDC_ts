import Phaser, { GameObjects } from "phaser";

export class MainMenu extends Phaser.Scene {
  background: GameObjects.Image;
  playButton: GameObjects.Image;

  constructor() {
    super('main_menu');
  };

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "main_menu_scene");
    this.playButton = this.add.image(cameraWidth / 2, cameraHeight / 2, 'play_button');
    this.background.setScale(1);

    this.playButton.setInteractive();
    this.playButton.on('pointerdown', () => {
      this.scene.start('main_game');
    })

  }
}