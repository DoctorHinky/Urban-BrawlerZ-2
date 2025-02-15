import Characters from "../Game/Characters";

class Player {
  constructor(characterName = "Huntriz") { // Default to "Huntriz", can be overridden
    this.characterName = characterName;
    console.log("Selected Character:", this.characterName);

    if (!Characters[this.characterName]) {
      throw new Error(`Character ${this.characterName} not found in Characters.js`);
    }

    this.character = Characters[this.characterName];
    this.position = { x: 100, y: 100 };

    // Example of setting fixed size (this can be dynamic later)
    this.character.setFixedSize(150, 100); // Resize sprite to 100x100
  }

  changeState(newState) {
    if (this.character) {
      this.character.changeState(newState);
    }
  }

  getCurrentSpriteSheet() {
    return this.character.getCurrentSpriteSheet();
  }
}

export default Player;






