import { Scene } from "phaser";
import { Player } from "../classes/player.js";
import words from "../data.json";
let playerOne;
let playerTwo; // TODO: figure out how to implement multiplayer & CPU
let curWord = ""; //holds the state of the current word that the player is typing
let wordBoard; //displays the current word
export class Game extends Scene {
  constructor() {
    super("Game");
  }
  create() {
    curWord = getRandomWord();
    this.cameras.main.setBackgroundColor(0x00ff00);
    playerOne = new Player(this, 512, 384, 64, 64);
    console.log(playerOne);
    // this.add.image(512, 384, 'background').setAlpha(0.2);
    // this.input.once('pointerdown', () => {

    //     this.scene.start('GameOver');
    // });
    wordBoard = this.add
      .text(512, 384, curWord, {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);
    /* 
    Here we will create our watcher for keyboard input. We will use the handler function handleKeyboardInput() to decide what to do next.
    This does not need to be in the update method because we are creating a new watcher that will be constantly listening for input. 
    Thus, it only needs to be created once at the beginning of the game. 
    */
    this.input.keyboard.on("keydown", handleKeyboardInput, this);
  }
  update() {
    wordBoard.setText(curWord); //constantly updates the display of the current word
  }
}
function handleKeyboardInput(event) {
  //check if input is valid letter in alphabet
  if (!str.match(/[a-z]/i)) return invalidInput();
  // check if input is correct
  if (event.key.toLowerCase() == curWord[0].toLowerCase()) return validInput;

  return invalidInput;
}

function invalidInput() {
  console.log("invalid input");
}

/**
 * Handles valid input from the player.
 * Removes the first letter from the current word, and moves on to the next letter.
 * If the current word has no more letters, generates a new word and increases the players power level by one.
 */
function validInput() {
  curWord = curWord.substring(1);
  console.log("valid input");
  if (curWord.length == 0) {
    curWord = getRandomWord();
    playerOne.power++;
  }
}

function getRandomWord() {
  words.words[Math.floor(Math.random() * words.words.length)];
}
