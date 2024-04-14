import { Scene } from "phaser";
import { Player } from "../classes/Player";
import words from "../data.json";
import { HealthBar } from "../classes/HealthBar";
let playerOne;
let playerTwo; // TODO: figure out how to implement multiplayer & CPU
let curWord = ""; //holds the state of the current word that the player is typing
let wordBoard; //displays the current word
let playerOneType = "test";
export class Game extends Scene {
  constructor() {
    super("Game");
  }
  preload() {
    this.load.image(
      playerOneType + "init",
      "/assets/players/" + playerOneType + "/init.png"
    );
    // this.load.spritesheet("boy", "images/boy.png", {
    //   frameWidth: 120,
    //   frameHeight: 200,
    // });
  }
  create() {
    curWord = getRandomWord();
    this.cameras.main.setBackgroundColor(0x00ff00);
    playerOne = createPlayer(this, playerOneType, 512, 384, 32, 32);

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
    playerOne.healthBar.updateGraphics(playerOne.health);
  }
}
function handleKeyboardInput(event) {
  console.log(event.key);
  //check if input is valid letter in alphabet
  if (!event.key.match(/[a-z]/i)) return invalidInput();
  // check if input is correct
  if (event.key.toLowerCase() == curWord[0].toLowerCase()) return validInput();

  return invalidInput();
}

function invalidInput() {
  console.log("invalid input");
}

/**
 * Handles valid input from the player.
 * Removes the first letter from the current word, and moves on to the next letter.
 * If the current word has no more letters, generates a new word and increases the players power level by one.
 * If the player reaches their max power level on that attack, they attack the other player.
 */
function validInput() {
  curWord = curWord.substring(1);
  console.log("valid input");
  if (curWord.length == 0) {
    curWord = getRandomWord();
    playerOne.power++;
    if (playerOne.power == playerOne.maxPower) {
      playerOne.attack(playerTwo);
    }
  }
}

function getRandomWord() {
  return words.words[Math.floor(Math.random() * words.words.length)];
}

function createPlayer(scene, playerType, x, y, width, height) {
  const player = new Player(scene, playerType, 512, 384, 64, 64);
  player.healthBar = new HealthBar(scene, 100, 100, 200, 20, 0xffffff);
  player.healthBar.create();
  return player;
}
