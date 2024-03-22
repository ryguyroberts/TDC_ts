import Phaser, { GameObjects } from "phaser";

export class MainMenu extends Phaser.Scene {
  private background: GameObjects.Image;
  private playButton: GameObjects.Image;
  private normalScale: number;
  private hoverScale: number;
  private originalButtonX: number;
  private originalButtonY: number;


  constructor() {
    super('main_menu');
  };

  create() {
    // Background and Play Button
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "main_menu_scene");
    this.background.setScale(1);
    this.playButton = this.add.image(550, 730, 'play_button');
    this.playButton.setScale(0.5);

    // Menu BGM
    const menuBGM = this.sound.add('menu_bgm', { loop: true, volume: 0.15 });
    menuBGM.play();

    // Initialize position & scale values for button
    this.normalScale = 0.5;
    this.hoverScale = 0.6;
    this.originalButtonX = this.playButton.x;
    this.originalButtonY = this.playButton.y;

    // Button SFX
    const buttonSFX = this.sound.add('play_button_bleep');
    const clickSFX = this.sound.add('click');

    this.playButton.on('pointerover', () => {
      this.playButton.setScale(this.hoverScale);
      this.playButton.setPosition(550, 730);
      this.setCursor('pointer');
      buttonSFX.play();
    });

    this.playButton.on('pointerout', () => {
      this.playButton.setScale(this.normalScale);
      this.playButton.setPosition(this.originalButtonX, this.originalButtonY);
      this.setCursor('default');
    });

    this.playButton.setInteractive();
    this.playButton.on('pointerdown', () => {
      menuBGM.stop();
      clickSFX.play();
      this.setCursor('default');
      this.scene.start('main_game');
    });
  }

  setCursor(cursorType: string) {
    this.input.setDefaultCursor(cursorType);
  }

}