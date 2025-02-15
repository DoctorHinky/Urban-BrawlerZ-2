import HuntrizIdle from "../../assets/Characters/Huntriz/HuntrizIdle.png";
import HuntrizAttack1 from "../../assets/Characters/Huntriz/HuntrizAttack1.png";
import HuntrizAttack2 from "../../assets/Characters/Huntriz/HuntrizAttack2.png";
import HuntrizAttack3 from "../../assets/Characters/Huntriz/HuntrizAttack3.png";
import HuntrizHit from "../../assets/Characters/Huntriz/HuntrizHit.png";
import HuntrizLoose from "../../assets/Characters/Huntriz/HuntrizLoose.png";
import HuntrizJump from "../../assets/Characters/Huntriz/HuntrizJump.png";
import HuntrizRun from "../../assets/Characters/Huntriz/HuntrizRun.png";

import CountessIdle from "../../assets/Characters/Countess/Idle.png";
import CountessAttack from "../../assets/Characters/Countess/Attack_1.png";
import CountessRun from "../../assets/Characters/Countess/Walk.png";
import CountessHit from "../../assets/Characters/Countess/Hurt.png";
import CountessLoose from "../../assets/Characters/Countess/Dead.png";
import CountessJump from "../../assets/Characters/Countess/Jump.png";

import SwagerIdle from "../../assets/Characters/Swager/Idle.png";
import SwagerAttack from "../../assets/Characters/Swager/Attack_1.png";
import SwagerRun from "../../assets/Characters/Swager/Walk.png";
import SwagerHit from "../../assets/Characters/Swager/Hurt.png";
import SwagerLoose from "../../assets/Characters/Swager/Dead.png";
import SwagerJump from "../../assets/Characters/Swager/Jump.png";

import TakahachiIdle from "../../assets/Characters/Takahachi/Idle.png";
import TakahachiAttack from "../../assets/Characters/Takahachi/Attack1.png";
import TakahachiRun from "../../assets/Characters/Takahachi/Run.png";
import TakahachiHit from "../../assets/Characters/Takahachi/Hurt.png";
import TakahachiLoose from "../../assets/Characters/Takahachi/Dead.png";
import TakahachiJump from "../../assets/Characters/Takahachi/Jump_1.png";

import FeralIdle from "../../assets/Characters/Feral/Idle.png";
import FeralAttack from "../../assets/Characters/Feral/Attack_1.png";
import FeralRun from "../../assets/Characters/Feral/Walk.png";
import FeralHit from "../../assets/Characters/Feral/Hurt.png";
import FeralLoose from "../../assets/Characters/Feral/Dead.png";
import FeralJump from "../../assets/Characters/Feral/Jump.png";

import KitsuneIdle from "../../assets/Characters/Kitsune/Idle.png";
import KitsuneAttack from "../../assets/Characters/Kitsune/Attack_1.png";
import KitsuneRun from "../../assets/Characters/Kitsune/Walk.png";
import KitsuneHit from "../../assets/Characters/Kitsune/Hurt.png";
import KitsuneLoose from "../../assets/Characters/Kitsune/Dead.png";
import KitsuneJump from "../../assets/Characters/Kitsune/Jump.png";

import BanchoIdle from "../../assets/Characters/Bancho/Bancho_Idle.png";
import BanchoAttack from "../../assets/Characters/Bancho/Bancho_attack1.png";
import BanchoRun from "../../assets/Characters/Bancho/Bancho_walk.png";
import BanchoHit from "../../assets/Characters/Bancho/Bancho_Hurt.png";
import BanchoLoose from "../../assets/Characters/Bancho/Bancho_Hurt.png";
import BanchoJump from "../../assets/Characters/Bancho/Bancho_Jump.png";

import BattyIdle from "../../assets/Characters/Batty/Idle.png";
import BattyAttack from "../../assets/Characters/Batty/Attack1.png";
import BattyRun from "../../assets/Characters/Batty/Walk.png";
import BattyHit from "../../assets/Characters/Batty/Hurt.png";
import BattyLoose from "../../assets/Characters/Batty/Hurt.png";
import BattyJump from "../../assets/Characters/Batty/Jump.png";

import BrutusIdle from "../../assets/Characters/Brutus/Idle.png";
import BrutusAttack from "../../assets/Characters/Brutus/Attack1.png";
import BrutusRun from "../../assets/Characters/Brutus/Walk.png";
import BrutusHit from "../../assets/Characters/Brutus/Hurt.png";
import BrutusLoose from "../../assets/Characters/Brutus/Hurt.png";
import BrutusJump from "../../assets/Characters/Brutus/Jump.png";
class Character {
  constructor(name, assets, scale = 1) { // Default scale is 1
    this.name = name;
    this.scale = scale; // Each character gets its own scale
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
      frameWidth: state.frameWidth,
      frameHeight: state.frameHeight,
      frameCount: state.frameCount,
    };
  }
}

// Define character data, each with its own scale
const Characters = {
  Huntriz: new Character("Huntriz", {
    idle: HuntrizIdle,
    attack: HuntrizAttack1,
    attack2: HuntrizAttack2,
    attack3: HuntrizAttack3,
    run: HuntrizRun,
    hit: HuntrizHit,
    loose: HuntrizLoose,
    jump: HuntrizJump,
    frameWidth: 150,
    frameHeight: 150,
    frameCount: {
      idle: 8,
      attack: 6,
      attack2: 6,
      attack3: 6,
      run: 8,
      hit: 8,
      loose: 8,
      jump: 8,
    },
  }, 3), // Scaling factor for Huntriz

  Countess: new Character("Countess", {
    idle: CountessIdle,
    attack: CountessAttack,
    run: CountessRun,
    hit: CountessHit,
    loose: CountessLoose,
    jump: CountessJump,
    frameWidth: 128,
    frameHeight: 128,
    frameCount: {
      idle: 5,
      attack: 6,
      run: 8,
      hit: 8,
      loose: 8,
      jump: 8,
    },
  }, 1.5), // Scaling factor for Countess


Swager: new Character("Swager", {
  idle: SwagerIdle,
  attack: SwagerAttack,
  run: SwagerRun,
  hit: SwagerHit,
  loose: SwagerLoose,
  jump: SwagerJump,
  frameWidth: 128,
  frameHeight: 128,
  frameCount: {
    idle: 6,
    attack: 6,
    run: 8,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 1.5), // Scaling factor for Countess

Takahachi: new Character("Takahachi", {
  idle: TakahachiIdle,
  attack: TakahachiAttack,
  run: TakahachiRun,
  hit: TakahachiHit,
  loose: TakahachiLoose,
  jump: TakahachiJump,
  frameWidth: 200,
  frameHeight: 200,
  frameCount: {
    idle: 4,
    attack: 6,
    run: 8,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 1.5), // Scaling factor for Countess

Feral: new Character("Feral", {
  idle: FeralIdle,
  attack: FeralAttack,
  run: FeralRun,
  hit: FeralHit,
  loose: FeralLoose,
  jump: FeralJump,
  frameWidth: 96,
  frameHeight: 96,
  frameCount: {
    idle: 9,
    attack: 6,
    run: 10,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 3), // Scaling factor for Countess

Kitsune: new Character("Kitsune", {
  idle: KitsuneIdle,
  attack: KitsuneAttack,
  run: KitsuneRun,
  hit: KitsuneHit,
  loose: KitsuneLoose,
  jump: KitsuneJump,
  frameWidth: 128,
  frameHeight: 128,
  frameCount: {
    idle: 8,
    attack: 6,
    run: 8,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 3), // Scaling factor for Countess

Bancho: new Character("Bancho", {
  idle: BanchoIdle,
  attack: BanchoAttack,
  run: BanchoRun,
  hit: BanchoHit,
  loose: BanchoLoose,
  jump: BanchoJump,
  frameWidth: 100,
  frameHeight: 100,
  frameCount: {
    idle: 7,
    attack: 6,
    run: 6,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 3), // Scaling factor for Countess

Batty: new Character("Batty", {
  idle: BattyIdle,
  attack: BattyAttack,
  run: BattyRun,
  hit: BattyHit,
  loose: BattyLoose,
  jump: BattyJump,
  frameWidth: 96,
  frameHeight: 96,
  frameCount: {
    idle: 9,
    attack: 6,
    run: 10,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 3), // Scaling factor for Countess

Brutus: new Character("Brutus", {
  idle: BrutusIdle,
  attack: BrutusAttack,
  run: BrutusRun,
  hit: BrutusHit,
  loose: BrutusLoose,
  jump: BrutusJump,
  frameWidth: 100,
  frameHeight: 101,
  frameCount: {
    idle: 8,
    attack: 6,
    run: 6,
    hit: 8,
    loose: 8,
    jump: 8,
  },
}, 3), // Scaling factor for Countess
};

export { Character };
export default Characters;




