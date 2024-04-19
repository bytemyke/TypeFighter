import { Scene } from "phaser";
import powerData from "../data/power.json";

// @ts-ignore - ignore import warning for the time being
import { Player } from "../classes/Player";
import { Cpu } from "../classes/Cpu";
import words from "../data/words.json";
import { PowerBar } from "../classes/PowerBar";
import { HealthBar } from "../classes/HealthBar";
let gameOver = true;
let playerOne;
let playerTwo; // TODO: figure out how to implement multiplayer & CPU
let curWord = ""; //holds the state of the current word that the player is typing
let wordBoard; //displays the current word
/* variables to change to dynamic */
// let multiplayer = false;
let wordList = getWordList();
export class Game extends Scene {
  init(data) {
    data.mode == "single" || data.mode == "multi"
      ? (this.mode = data.mode)
      : (this.mode = "single");
    typeof data == "object"
      ? (this.power = data.power)
      : (this.power = powerData.powers[0]);
    if (this.mode == "multi") {
      if (data.players.length <= 1) {
        this.mode = "single";
      } else {
        this.players = data.players;
        this.isHost = data.isHost;
      }
    }
  }
  constructor(title = "Game") {
    super(title);
  }
  create() {
    // this.scale.startFullscreen();
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "fight_background")
      .setOrigin(0.5);

    this.overlay = this.add
      .rectangle(
        screenCenterX,
        screenCenterY,
        this.background.displayWidth,
        this.background.displayHeight,
        0x222224
      )
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5);

    this.createPlayers();
    this.overlay.alpha = 0.25;

    this.cameras.main.setBackgroundColor(0x808080);

    console.log(this.sys.game.scale.gameSize);
    curWord = wordList[0];
    /*Create players and player assets (health bars, power bars)*/
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
    if (gameOver == true) return;
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
    handleKeyboardInput(
      {
        key: key,
      },
      playerTwo
    );
  }
  createPlayers() {
    if (this.mode == "multi") {
      // multiplayer = true;
    } else {
      playerOne = createPlayer(this, this.power, 470, 390, curWord);
      playerTwo = createCpu(
        this,
        getRandomPower(),
        this.sys.game.scale.gameSize.width - 200,
        380,
        curWord
      );
    }
  }
}

/* Creation logic */

function createPlayer(scene, power, x, y, width, height, curWord) {
  const player = new Player(scene, power, x, y, width, height);
  player.healthBar = new HealthBar(scene, 100, 100, 200, 20, 0xffffff);
  player.healthBar.create();
  player.powerBar = new PowerBar(scene, 100, 200, 20, 200, 0xffffff);
  player.powerBar.create();
  player.curWord = curWord;
  player.curWordIndex = 0;
  return player;
}
function createCpu(scene, power, x, y, width, height, curWord) {
  const cpu = new Cpu(scene, power, x, y, width, height);
  cpu.healthBar = new HealthBar(scene, 750, 100, 200, 20, 0xffffff);
  cpu.healthBar.create();
  cpu.powerBar = new PowerBar(scene, 950, 200, 20, 200, 0xffffff);
  cpu.powerBar.create();
  cpu.curWord = curWord;
  cpu.curWordIndex = 0;
  return cpu;
}

function updatePlayerStats(player) {
  player.healthBar.updateGraphics(player.health);
  player.powerBar.updateGraphics(player.power);
}

/*Game logic*/
function handleKeyboardInput(event, player = playerOne) {
  console.log(player.curWord);
  if (gameOver == true) return;
  console.log(event.key);
  //check if input is valid letter in alphabet
  if (!event.key.match(/[a-z]/i)) return invalidInput(player);
  // check if input is correct
  if (event.key.toLowerCase() == player.curWord[0].toLowerCase())
    return validInput(player);

  return invalidInput(player);
}
function invalidInput(player) {
  player.power = 0;
  console.log("invalid input");
}

/**
 * Handles valid input from the player.
 * Removes the first letter from the current word, and moves on to the next letter.
 * If the current word has no more letters, generates a new word, adds new word to wordList and increases the players power level by one.
 * If the player reaches their max power level on that attack, they attack the other player.
 */
function validInput(player) {
  player.curWord = player.curWord.substring(1);
  console.log("valid input");
  if (player.curWord.length == 0) {
    // generate new word
    wordList.push(getRandomWord());
    //get next word from list
    player.curWordIndex++;
    player.curWord = wordList[player.curWordIndex];
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

function getWordList() {
  let wordList = words.words;
  let myList = [];
  for (let i = 0; i < 10; i++) {
    myList.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return myList;
}

function getRandomPower() {
  return powerData.powers[Math.floor(Math.random() * powerData.powers.length)];
}
