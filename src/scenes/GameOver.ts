import Phaser, { GameObjects } from "phaser";
import { handlePointerOver, handlePointerOut } from "../utils/buttonPop";

export class GameOver extends Phaser.Scene {
  background: GameObjects.Image;
  // private exitButton: GameObjects.Image;
  private tryAgainButton: GameObjects.Image;
  private normalScale: number;
  private hoverScale: number;
  private originalTryAgainX: number;
  private originalTryAgainY: number;
  // private originalExitX: number;
  // private originalExitY: number;

  constructor() {
    super('game_over');
  };

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "game_over_scene");
    // this.exitButton = this.add.image(1000, 600, "exit");
    this.tryAgainButton = this.add.image(815, 600, "try_again");

    // Game Over BGM
    const gameOverBGM = this.sound.add('game_over_bgm', { loop: true, volume: 0.3 });
    gameOverBGM.play();

    // Button SFX
    const buttonSFX = this.sound.add('play_button_bleep');
    const clickSFX = this.sound.add('click');

    // Initialize position & scale for buttons
    this.normalScale = 1;
    this.hoverScale = 1.1;

    // this.originalExitX = this.exitButton.x;
    // this.originalExitY = this.exitButton.y;
    // this.exitButton.setInteractive();

    this.originalTryAgainX = this.tryAgainButton.x;
    this.originalTryAgainY = this.tryAgainButton.y;
    this.tryAgainButton.setInteractive();

    // Hover and Unhover of buttons
    // this.exitButton.on('pointerover', () => {
    //   handlePointerOver(this.exitButton, this.hoverScale, 1000, 600, 'pointer', this, buttonSFX);
    // });

    // this.exitButton.on('pointerout', () => {
    //   handlePointerOut(this.exitButton, this.normalScale, this.originalExitX, this.originalExitY, 'default', this);
    // });

    this.tryAgainButton.on('pointerover', () => {
      handlePointerOver(this.tryAgainButton, this.hoverScale, 815, 600, 'pointer', this, buttonSFX);
    });

    this.tryAgainButton.on('pointerout', () => {
      handlePointerOut(this.tryAgainButton, this.normalScale, this.originalTryAgainX, this.originalTryAgainY, 'default', this);

    });

    // Buttons Redirect to new scenes
    // this.exitButton.on('pointerdown', () => {
    //   gameOverBGM.stop();
    //   clickSFX.play();
    //   setCursor('default', this);
    //   window.location.reload()
    //   // this.restartGame();
    //   this.scene.start('main_menu');
    // });

    this.tryAgainButton.on('pointerdown', () => {
      gameOverBGM.stop();
      clickSFX.play();
      window.location.reload();
    }) 
  }
}