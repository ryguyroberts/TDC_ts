import { Game, Types } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { UI } from "./scenes/UI";
import { MainGame } from "./scenes/MainGame";


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1600,
    height: 960,
    parent: 'game-container',
    // backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        // Debig physics
        // debug: true
      }
    },
    scene: [
      Preloader,
      MainGame,
      UI,
    ]
};

export default new Game(config);
