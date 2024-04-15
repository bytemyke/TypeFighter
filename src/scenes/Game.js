import { Scene } from "phaser";
// @ts-ignore - ignore import warning for the time being
import { Player } from "../classes/Player";
import { Cpu } from "../classes/Cpu";
import words from "../data.json";
import { PowerBar } from "../classes/PowerBar";
import { HealthBar } from "../classes/HealthBar";
let gameOver = true;
let playerOne;
let playerTwo; // TODO: figure out how to implement multiplayer & CPU
let curWord = ""; //holds the state of the current word that the player is typing
let wordBoard; //displays the current word

/* variables to change to dynamic */
let playerOneType = "test";
let playerTwoType = "test";
let multiplayer = false;

export class Game extends Scene {
  constructor() {
    super("Game");
  }
  preload() {
    // load both player's default images
    this.load.image(
      playerOneType + "init",
      "/assets/players/" + playerOneType + "/init.png"
    );
    if (playerOneType != playerTwoType) {
      this.load.image(
        playerTwoType + "init",
        "/assets/players/" + playerTwoType + "/init.png"
      );
    }
    // this.load.spritesheet("boy", "images/boy.png", {
    //   frameWidth: 120,
    //   frameHeight: 200,
    // });
  }
  create() {
    console.log(this.sys.game.scale.gameSize);
    curWord = getRandomWord();
    this.cameras.main.setBackgroundColor(0x808080);
    /*Create players and player assets (health bars, power bars)*/
    playerOne = createPlayer(this, playerOneType, 250, 384, 32, 32, curWord);
    if (multiplayer == false) {
      playerTwo = createCpu(
        this,
        playerTwoType,
        this.sys.game.scale.gameSize.width,
        384,
        32,
        32, curWord
      );
    } else {
      //implement multiplayer
    }
    playerTwo.flipX = true;
    playerOne.target = playerTwo;
    playerTwo.target = playerOne;
    wordBoard = this.add
      .text(512, 384, playerOne.curWord, {
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
    gameOver = false;
  }
  update() {
    if (gameOver == true) return;
    wordBoard.setText(playerOne.curWord); //constantly updates the display of the current word
    updatePlayerStats(playerOne);
    updatePlayerStats(playerTwo);
  }
  gameOver(winningPlayer) {
    let text;
    winningPlayer == playerOne
      ? (text = this.add.text(512, 384, "YOU WIN!!!", {
        fontFamily: "Arial Black",
        fontSize: 50,
        color: "#00FF7F",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      }))
      : this.add.text(512, 384, "YOU LOSE", {
        fontFamily: "Arial Black",
        fontSize: 50,
        color: "#ffffff",
        stroke: "#D2042D",
        strokeThickness: 8,
        align: "center",
      });
    //allow for restart, TODO : change to back to main menu
    this.input.keyboard.on("keydown", (event) => {
      if (event.key == "Enter") {
        this.scene.start("Game");
      }
    });
  }
  cpuInput(key) {

  }
}

/* Creation logic */

function createPlayer(scene, playerType, x, y, width, height, curWord) {
  const player = new Player(scene, playerType, x, y, width, height);
  player.healthBar = new HealthBar(scene, 100, 100, 200, 20, 0xffffff);
  player.healthBar.create();
  player.powerBar = new PowerBar(scene, 100, 200, 20, 200, 0xffffff);
  player.powerBar.create();
  player.curWord = curWord;
  return player;
}
function createCpu(scene, playerType, x, y, width, height) {
  const cpu = new Cpu(scene, playerType, x, y, width, height);
  cpu.healthBar = new HealthBar(scene, 750, 100, 200, 20, 0xffffff);
  cpu.healthBar.create();
  cpu.powerBar = new PowerBar(scene, 950, 200, 20, 200, 0xffffff);
  cpu.powerBar.create();
  return cpu;
}

function updatePlayerStats(player) {
  player.healthBar.updateGraphics(player.health);
  player.powerBar.updateGraphics(player.power);
}

/*Game logic*/
function handleKeyboardInput(event, player = playerOne) {
  console.log(player.curWord)
  if (gameOver == true) return;
  console.log(event.key);
  //check if input is valid letter in alphabet
  if (!event.key.match(/[a-z]/i)) return invalidInput(player);
  // check if input is correct
  if (event.key.toLowerCase() == player.curWord[0].toLowerCase()) return validInput(player);

  return invalidInput(player);
}
function invalidInput(player) {
  player.power = 0;
  console.log("invalid input");
}

/**
 * Handles valid input from the player.
 * Removes the first letter from the current word, and moves on to the next letter.
 * If the current word has no more letters, generates a new word and increases the players power level by one.
 * If the player reaches their max power level on that attack, they attack the other player.
 */
function validInput(player) {
  player.curWord = player.curWord.substring(1);
  console.log("valid input");
  if (player.curWord.length == 0) {
    player.curWord = getRandomWord();
    player.power++;
    console.log(player.power, player.maxPower);
    if (player.power == player.maxPower) {
      console.log("max");
      player.attack(player.target);
      player.power = 0;
    }
  }
}

function getRandomWord() {
  return words.words[Math.floor(Math.random() * words.words.length)];
}
