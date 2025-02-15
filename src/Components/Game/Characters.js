import HuntrizIdle from "../../assets/Characters/Huntriz/HuntrizIdle.png";
import HuntrizAttack from "../../assets/Characters/Huntriz/HuntrizAttack1.png";
import HuntrizRun from "../../assets/Characters/Huntriz/HuntrizRun.png";

class Character {
  constructor(name, assets) {
    this.name = name;
    this.states = {
      idle: {
        spriteSheet: assets.idle,
        frameWidth: assets.frameWidth,
        frameHeight: assets.frameHeight,
        frameCount: assets.frameCount.idle,
        preloadedSprite: new Image(),
      },
      attack: {
        spriteSheet: assets.attack,
        frameWidth: assets.frameWidth,
        frameHeight: assets.frameHeight,
        frameCount: assets.frameCount.attack,
        preloadedSprite: new Image(),
      },
      run: {
        spriteSheet: assets.run,
        frameWidth: assets.frameWidth,
        frameHeight: assets.frameHeight,
        frameCount: assets.frameCount.run,
        preloadedSprite: new Image(),
      },
    };
    this.currentState = "idle";
    this.currentFrame = 0;

    // Preload sprites for each state
    this.states.idle.preloadedSprite.src = assets.idle;
    this.states.attack.preloadedSprite.src = assets.attack;
    this.states.run.preloadedSprite.src = assets.run;

    // Default fixed size for the character (can be updated by Player class)
    this.fixedWidth = 150;
    this.fixedHeight = 150;
  }

  // This method allows setting the fixed size for the character
  setFixedSize(width, height) {
    this.fixedWidth = width;
    this.fixedHeight = height;
  }

  changeState(newState) {
    if (this.states[newState]) {
      this.currentState = newState;
      this.currentFrame = 0; // Reset animation frame on state change
    }
  }

  getCurrentSpriteSheet() {
    return this.states[this.currentState].preloadedSprite;
  }

  getCurrentFrameData() {
    const state = this.states[this.currentState];
    return {
      preloadedSprite: state.preloadedSprite,
      frameWidth: this.fixedWidth,  // Use fixed width
      frameHeight: this.fixedHeight, // Use fixed height
      frameCount: state.frameCount,
    };
  }
}

// Define character data including frame sizes
const Characters = {
  Huntriz: new Character("Huntriz", {
    idle: HuntrizIdle,
    attack: HuntrizAttack,
    run: HuntrizRun,
    frameWidth: 150, // Original frame dimensions
    frameHeight: 150,
    frameCount: {
      idle: 8, // Number of frames in the idle animation
      attack: 6,
      run: 8,
    },
  }),
};

export { Character };
export default Characters;

