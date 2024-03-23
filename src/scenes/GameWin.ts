import Phaser, { GameObjects } from "phaser";

export class GameWin extends Phaser.Scene {
  background: GameObjects.Image;
  private exitButton: GameObjects.Image;
  private tryAgainButton: GameObjects.Image;
  private normalScale: number;
  private hoverScale: number;
  private originalTryAgainX: number;
  private originalTryAgainY: number;
  private originalExitX: number;
  private originalExitY: number;

  constructor() {
    super('game_win');
  };

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "game_over_scene");
    this.exitButton = this.add.image(1000, 600, "exit");
    this.tryAgainButton = this.add.image(600, 600, "try_again");

    // Game Over BGM
    const gameOverBGM = this.sound.add('game_over_bgm', { loop: true, volume: 0.3 });
    gameOverBGM.play();

    // Button SFX
    const buttonSFX = this.sound.add('play_button_bleep');
    const clickSFX = this.sound.add('click');

    // Initialize position & scale for buttons
    this.normalScale = 1;
    this.hoverScale = 1.1;

    this.originalExitX = this.exitButton.x;
    this.originalExitY = this.exitButton.y;
    this.exitButton.setInteractive();

    this.originalTryAgainX = this.tryAgainButton.x;
    this.originalTryAgainY = this.tryAgainButton.y;
    this.tryAgainButton.setInteractive();

    // Hover and Unhover of buttons
    this.exitButton.on('pointerover', () => {
      this.exitButton.setScale(this.hoverScale);
      this.exitButton.setPosition(1000, 600);
      this.setCursor('pointer');
      buttonSFX.play();
    });

    this.exitButton.on('pointerout', () => {
      this.exitButton.setScale(this.normalScale);
      this.exitButton.setPosition(this.originalExitX, this.originalExitY);
      this.setCursor('default');
    });

    this.tryAgainButton.on('pointerover', () => {
      this.tryAgainButton.setScale(this.hoverScale);
      this.tryAgainButton.setPosition(600, 600);
      this.setCursor('pointer');
      buttonSFX.play();
    });

    this.tryAgainButton.on('pointerout', () => {
      this.tryAgainButton.setScale(this.normalScale);
      this.tryAgainButton.setPosition(this.originalTryAgainX, this.originalTryAgainY);
      this.setCursor('default');
    });

    // Buttons Redirect to new scenes
    this.exitButton.on('pointerdown', () => {
      gameOverBGM.stop();
      clickSFX.play();
      this.setCursor('default');
      this.scene.start('main_menu');
    });

    this.tryAgainButton.on('pointerdown', () => {
      gameOverBGM.stop();
      clickSFX.play();
      this.setCursor('default');
      this.scene.start('main_game');
    }) 
  }

  setCursor(cursorType: string) {
    this.input.setDefaultCursor(cursorType);
  }
}