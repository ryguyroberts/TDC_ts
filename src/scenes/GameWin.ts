import Phaser, { GameObjects } from "phaser";
import { handlePointerOver, handlePointerOut } from "../utils/buttonPop";

export class GameWin extends Phaser.Scene {
  background: GameObjects.Image;
  private exitButton: GameObjects.Image;
  private normalScale: number;
  private hoverScale: number;
  private originalExitX: number;
  private originalExitY: number;

  constructor() {
    super('game_win');
  };

  create() {
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;
    this.background = this.add.image(cameraWidth / 2, cameraHeight / 2, "game_win_scene");
    this.exitButton = this.add.image(800, 600, "exit");
    this.exitButton.setScale(0.8);

    // Game Over BGM
    const gameWinBGM = this.sound.add('game_win_bgm', { loop: true, volume: 1 });
    const initialWinSFX = this.sound.add('ff_win');
    initialWinSFX.play();
    setTimeout(() => {
      gameWinBGM.play();
    }, 4500);

    // Button SFX
    const buttonSFX = this.sound.add('play_button_bleep');
    const clickSFX = this.sound.add('click');

    // Initialize position & scale for buttons
    this.normalScale = 0.8;
    this.hoverScale = 0.9;

    this.originalExitX = this.exitButton.x;
    this.originalExitY = this.exitButton.y;
    this.exitButton.setInteractive();

    // Hover and Unhover of buttons
    this.exitButton.on('pointerover', () => {
      handlePointerOver(this.exitButton, this.hoverScale, 800, 600, 'pointer', this, buttonSFX);
    });

    this.exitButton.on('pointerout', () => {
      handlePointerOut(this.exitButton, this.normalScale, this.originalExitX, this.originalExitY, 'default', this);
    });

    // Buttons Redirect to new scenes
    this.exitButton.on('pointerdown', () => {
      gameWinBGM.stop();
      clickSFX.play();
      window.location.reload();
    });
  }
}