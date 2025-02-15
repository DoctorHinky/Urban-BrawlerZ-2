import Characters from "./Characters.js";

class Player {
  constructor() {
    this.character = Characters.Brutus;
    this.position = { x: 0, y: 0 };
    console.log("Player initialized with character:", this.character.name);
  }

  changeState(state) {
    this.character.changeState(state);
    console.log(`Player state changed to: ${state}`);
  }

  setScale(scale) {
    this.character.setScale(scale);
    console.log(`Player scale set to: ${scale}`);
  }
}

export default Player;








