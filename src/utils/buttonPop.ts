import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }
}

// Reusable function to handle pointer over event
const handlePointerOver = (button: Phaser.GameObjects.Image , hoverScale: number, hoverX: number, hoverY: number, cursorType: string, context: BaseScene, buttonSFX: Phaser.Sound.BaseSound) => {
  button.setScale(hoverScale);
  button.setPosition(hoverX, hoverY);
  setCursor(cursorType, context);
  buttonSFX.play();
};

// Reusable function to handle pointer out event
const handlePointerOut = (button: Phaser.GameObjects.Image, normalScale: number, originalButtonX: number, originalButtonY: number, cursorType: string, context: BaseScene) => {
  button.setScale(normalScale);
  button.setPosition(originalButtonX, originalButtonY);
  setCursor(cursorType, context);
};

// Function to set cursor style
function setCursor(cursorType: string, context: BaseScene) {
  context.input.setDefaultCursor(cursorType);
};

export { 
  handlePointerOver, 
  handlePointerOut, 
  setCursor, 
};