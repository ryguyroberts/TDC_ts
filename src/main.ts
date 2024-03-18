import { Game, Types } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { MainGame } from "./scenes/MainGame";


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
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
        debug: true
      }
    },
    scene: [
      Preloader,
      MainGame
    ]
};

export default new Game(config);
