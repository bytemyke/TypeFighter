/**
+ * Game.js
+ * 
+ * This scene is responsible for the gameplay logic of the game. 
+ * It handles keyboard input, generates a list of words to play with, and 
+ * updates the player's stats (power bar, health bar) based on player actions.
+ * 
+ * This scene also handles multiplayer, with a fallback for if a player cannot 
+ * retrieve the same list of words from the host. 
+ * 
+ */
import { Scene } from "phaser";
import powerData from "../data/power.json";

// @ts-ignore - ignore import warning for the time being
import { Player } from "../classes/Player";
import { Cpu } from "../classes/Cpu";
import words from "../data/words.json";
import { PowerBar } from "../classes/PowerBar";
import { HealthBar } from "../classes/HealthBar";
import { createMuteOption } from "../functions/createMuteOption";
import { flash } from "../functions/flash";
import {
  setState,
  getState,
  resetStates,
  resetPlayersStates,
} from "playroomkit";
let preData; // holds the data passed from the Past scene
let endingGameText; //holds the text that displays when the game is over
let canLeave = true;
let screenCenterX;
let screenCenterY;
const powerBarWidth = 125;
const powerBarHeight = 20;
let gameOver = true; //game state (set to false after game is created and back to true when game is over)
let playerOne;
let playerTwo;
let curWord = ""; //holds the state of the current word that the player is typing
let wordBoard; //displays the current word
/* variables to change to dynamic */
// let multiplayer = false;
let wordList = [];
let mode = "single"; //state of game mode. singleplayer or multiplayer.
let isHost; //determines if user is the host or not. this.isHost
let errorSound; // holds the error sound. this be played when an invalid input is made
let waiting = false; //determines if player is waiting for another player to reset
/*
+ * The Game scene class.
+ * 
+ * This class is responsible for the gameplay logic of the game.
+ * It handles keyboard input, generates a list of words to play with, creates the players, 
+ * and updates the player's stats (power bar, health bar) based on player actions.
+ * 
+ * This scene also handles multiplayer, with a fallback for if a player cannot
+ * retrieve the same list of words from the host.
+ */
export class Game extends Scene {
  multiplayerAttackDelay = false;
  /**
+   * Initialize the game scene with the data passed from the Preloader scene.
+   * @param {Object} data - The data passed from the Preloader scene.
+   */
  async init(data) {
    preData = data;
    data.mode == "single" || data.mode == "multi"
      ? (mode = data.mode)
      : (mode = "single");
    typeof data == "object"
      ? (this.power = data.power)
      : (this.power = powerData.powers[0]);
    if (mode == "multi") {
      //if 2 valid players, set mode to multiplayer
      if (
        getState("hostPlayer") !== undefined &&
        getState("connectedPlayer") !== undefined
      ) {
        mode = "multi";
        this.isHost = data.isHost;
        isHost = data.isHost;
        wordList = await getState("wordList");
        //fallback if undefined
        if (wordList == undefined) wordList = getState("hostListFallback");
      } else mode = "single";
    }
    mode == "single" && typeof data.difficulty != "undefined"
      ? (this.difficulty = data.difficulty)
      : (this.difficulty = 2);
    if (mode == "multi") {
      setState("connectedPlayer", "waiting");
      setState("hostPlayer", "waiting");
    }
  }
  constructor(title = "Game") {
    super(title);
  }
  /**
   * The create function is called once per game instance, only once the game has fully loaded.
   * It is responsible for creating all of the elements of the game, including the
   * background, player and enemies. It also sets up any event listeners or timers.
   */
  async create() {
    if (mode == "single") {
      wordList = getWordList();
    }
    if (wordList[0] !== undefined) curWord = wordList[0];
    else curWord = "holder"; //will be changed later, sometimes multiplayer wordlist state is still loading here.
    //If connected player cannot retrieve same list from host, try loading the fall back list. If all else fails, generate new list

    // this.scale.startFullscreen();
    screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    screenCenterY =
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

    await this.createPlayers(curWord);
    this.overlay.alpha = 0.25;

    this.cameras.main.setBackgroundColor(0x808080);
    /*Create players and player assets (health bars, power bars)*/
    playerOne.target = playerTwo;
    playerTwo.target = playerOne;
    wordBoard = this.add
      .text(screenCenterX, screenCenterY - 200, 3, {
        fontFamily: "Arial Black",
        fontSize: 80,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 10,
        align: "center",
      })
      .setOrigin(0.5);
    errorSound = this.sound.add("error", { volume: 0.5 });
    createMuteOption(this);

    //Create a timer and start game after
    this.timedEvent = this.time.delayedCall(
      1000,
      () => {
        wordBoard.setText(2);
      },
      [],
      this
    );
    this.timedEvent = this.time.delayedCall(
      2000,
      () => {
        wordBoard.setText(1);
      },
      [],
      this
    );
    this.timedEvent = this.time.delayedCall(
      3000,
      () => {
        wordBoard.setText("FIGHT!");
      },
      [],
      this
    );
    if (mode == "multi") {
      // final fallback if connected player cannot retrieve same list from host
      if (typeof wordList == "undefined" || wordList[0] == undefined)
        wordList = getWordList();
      curWord = wordList[0];
      playerOne.curWord = curWord;
      playerTwo.curWord = curWord;
    }
    this.timedEvent = this.time.delayedCall(
      4000,
      () => {
        wordBoard.setText(curWord);
        /* 
    Here we will create our watcher for keyboard input. We will use the handler function handleKeyboardInput() to decide what to do next.
    This does not need to be in the update method because we are creating a new watcher that will be constantly listening for input. 
    Thus, it only needs to be created once at the beginning of the game. 
    */
        this.input.keyboard.on("keydown", handleKeyboardInput, this);
        gameOver = false;
      },
      [],
      this
    );
    //dev tool for testing game over
    // setTimeout(() => {
    //   playerOne.health = 0;
    //   this.gameOver(playerTwo);
    // }, 5000);
  }
  update() {
    if (gameOver == true) return;
    wordBoard.setText(playerOne.curWord); //constantly updates the display of the current word
    updatePlayerStats(playerOne);
    if (mode == "multi") {
      //get player two stats
      if (this.isHost == true) {
        playerTwo.energy = getState("connectedPlayerEnergy");
      } else {
        playerTwo.energy = getState("hostPlayerEnergy");
      }
    }
    updatePlayerStats(playerTwo);
    if (
      mode == "multi" &&
      playerTwo.energy == playerTwo.maxPower &&
      this.multiplayerAttackDelay == false
    ) {
      this.multiplayerAttackDelay = true;
      playerTwo.attack(playerTwo.target);
      playerTwo.energy = 0;
      if (isHost == true) setState("connectedPlayerEnergy", 0);
      else setState("hostPlayerEnergy", 0);
      setTimeout(() => {
        this.multiplayerAttackDelay = false;
      }, 1000);
    }
  }
  gameOver(winningPlayer) {
    gameOver = true;
    if (playerOne.health < 0) playerOne.health = 0;
    if (playerTwo.health < 0) playerTwo.health = 0;
    updatePlayerStats(playerOne);
    updatePlayerStats(playerTwo);
    wordBoard.setText("");
    if (mode == "single") clearInterval(playerTwo.interval);
    winningPlayer == playerOne
      ? this.add
          .text(screenCenterX - 280, screenCenterY - 200, "YOU WIN!!!", {
            fontFamily: "Caveat",
            fontSize: 300,
            color: "#00FF7F",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
          })
          .setScale(0.5)
      : this.add
          .text(screenCenterX - 280, screenCenterY - 200, "YOU LOSE", {
            fontFamily: "Caveat",
            fontSize: 320,
            color: "#ffffff",
            stroke: "#D2042D",
            strokeThickness: 8,
            align: "center",
          })
          .setScale(0.5);
    if (mode == "single")
      endingGameText = this.add
        .text(
          screenCenterX - 300,
          screenCenterY + 20,
          `Press Enter for a rematch
      OR
      Press Esc to go back to main menu`,
          {
            fontFamily: "Caveat",
            fontSize: 90,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
          }
        )
        .setScale(0.5);
    else {
      let multiplayerRestartText = ` 
      Go to the main Itch.io site 
      to host your own 
      and play with a friend.`;
      if(isHost == true) multiplayerRestartText = `Refresh the page to host
      a game with a different friend`
      endingGameText = this.add
        .text(
          screenCenterX - 260,
          screenCenterY + 20,
          `Press Enter for a rematch 
            with the same friend
      OR
      Press ESC to restart your game
       and play with a CPU.
      OR` + multiplayerRestartText,
          {
            fontFamily: "Caveat",
            fontSize: 60,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
          }
        )
        .setScale(0.5);
        
    }
  }

  cpuInput(key) {
    handleKeyboardInput(
      {
        key: key,
      },
      playerTwo
    );
  }
  async createPlayers(curWord) {
    let pOneX = 650;
    if (mode == "multi") {
      if (this.isHost == true) {
        playerOne = createPlayer(
          this,
          await getState("hostPlayerPower"),
          pOneX,
          390,
          curWord,
          true
        );
        playerTwo = createMultiPlayerTwo(
          this,
          await getState("connectedPlayerPower"),
          this.sys.game.scale.gameSize.width - 200,
          380,
          curWord
        );
      } else {
        playerOne = createPlayer(
          this,
          await getState("connectedPlayerPower"),
          pOneX,
          390,
          curWord,
          true
        );
        playerTwo = createMultiPlayerTwo(
          this,
          await getState("hostPlayerPower"),
          this.sys.game.scale.gameSize.width - 200,
          380,
          curWord
        );
      }
    } else {
      playerOne = createPlayer(this, this.power, pOneX, 390, curWord, true);
      playerTwo = createCpu(
        this,
        getRandomPower(),
        this.sys.game.scale.gameSize.width - 200,
        380,
        curWord,
        this.difficulty
      );
    }
    playerTwo.flipX = true;
  }
}

/* Creation logic */

/**
 * Creates a player one object.
 * @param {Phaser.Scene} scene - The scene the player is being created in.
 * @param {number} power - The power of the player.
 * @param {number} x - The x position of the player.
 * @param {number} y - The y position of the player.
 * @param {string} curWord - The word the player is currently typing.
 * @param {boolean} [firstPlayer=true] - Whether this is the first player or not.
 * @returns {Player} The created player.
 */
function createPlayer(scene, power, x, y, curWord, firstPlayer = true) {
  const player = new Player(scene, power, x, y, curWord);
  player.create(power);
  player.healthBar = new HealthBar(
    scene,
    100,
    100,
    400,
    30,
    0xffffff,
    firstPlayer
  );
  player.healthBar.create();
  (player.powerBar = new PowerBar(
    scene,
    205,
    100 + 15,
    powerBarHeight,
    powerBarWidth,
    0xffffff,
    player.maxPower
  )),
    player.powerBar.create();
  player.curWord = curWord;
  player.curWordIndex = 0;
  return player;
}

/**
 * Creates a player two object (only for multiplayer).
 * @param {Phaser.Scene} scene - The scene the player is being created in.
 * @param {number} power - The power of the player.
 * @param {number} x - The x position of the player.
 * @param {number} y - The y position of the player.
 * @param {string} curWord - The word the player is currently typing.
 * @param {boolean} [firstPlayer=true] - Whether this is the first player or not.
 * @returns {Player} The created player.
 */
function createMultiPlayerTwo(scene, power, x, y, curWord, firstPlayer) {
  const player = new Player(scene, power, x, y, curWord);
  player.create(power);
  player.healthBar = new HealthBar(
    scene,
    x / 2.5 - 20,
    100,
    400,
    30,
    0xffffff,
    firstPlayer
  );
  player.healthBar.create();
  player.powerBar = new PowerBar(
    scene,
    -300,
    100 + 15,
    powerBarHeight,
    powerBarWidth,
    0xffffff,
    player.maxPower
  );
  player.powerBar.create();
  player.curWord = curWord;
  player.curWordIndex = 0;
  return player;
}

/**
 * Creates a player two cpu object (only for singleplayer).
 * @param {Phaser.Scene} scene - The scene the player is being created in.
 * @param {number} power - The power of the player.
 * @param {number} x - The x position of the player.
 * @param {number} y - The y position of the player.
 * @param {string} curWord - The word the player is currently typing.
 * @param {boolean} [firstPlayer=true] - Whether this is the first player or not.
 * @returns {Player} The created player.
 */
function createCpu(scene, power, x, y, curWord) {
  const cpu = new Cpu(scene, power, x, y, curWord, false);
  cpu.create(power);
  cpu.healthBar = new HealthBar(scene, x / 2.5 - 20, 100, 400, 30, 0xffffff);
  cpu.healthBar.create();
  cpu.powerBar = new PowerBar(
    scene,
    772,
    100 + 15,
    powerBarHeight,
    powerBarWidth,
    0xffffff,
    cpu.maxPower
  );
  cpu.powerBar.create();
  cpu.curWord = curWord;
  cpu.curWordIndex = 0;
  return cpu;
}

function updatePlayerStats(player) {
  player.healthBar.updateGraphics(player.health);
  player.powerBar.updateGraphics(player.energy);
}

/*Game logic*/
function handleKeyboardInput(event, player = playerOne) {
  if (gameOver == true) {
    if(canLeave == false) return;
    canLeave = false;
    if (event.key == "Enter") {
      endingGameText.setText("");
      if (mode == "multi") multiplayerReset();
      else this.scene.start("Game", preData);
    } else if (event.key == "Escape") {
      endingGameText.setText("");

      if (mode == "multi") {
        setState("hostPlayer", "left");
        setState("connectedPlayer", "left");
        playerOne.scene.scene.start("MainMenu");
      } else playerOne.scene.scene.start("MainMenu");
    } else return;
  }
  //check if input is valid letter in alphabet
  if (!event.key.match(/[a-z]/i)) return invalidInput(player);
  // check if input is correctWF
  if (event.key.toLowerCase() == player.curWord[0].toLowerCase())
    return validInput(player);

  return invalidInput(player);
}
function invalidInput(player) {
  player.energy = 0;
  errorSound.play();
  flash(wordBoard, 0xff0000, 100);
  /*on multiplayer, update energy state for playerOne via playroom as well (only player one can have a keyboard input via multiplayer, 
  both are player one one their own systems) */
  if (mode == "multi") {
    if (isHost == true) setState("hostPlayerEnergy", player.energy);
    else setState("connectedPlayerEnergy", player.energy);
  }
}
function multiplayerReset() {
  if (isHost == true) {
    setState("hostPlayer", "ready");
    setState("hostPlayerPower", playerOne.power);
    setState("hostPlayerEnergy", 0);
    setState("hostPlayerHealth", 100);
    let waiting = setInterval(() => {
      if (getState("connectedPlayer") == "ready") {
        clearInterval(waiting);
        playerOne.scene.scene.start("Game", preData);
      } else if (getState("connectedPlayer") == "left") {
        endingGameText.setText(
          "The other player left. Refresh your browser to fully restart."
        );
      } else {
        endingGameText.setText(
          "Waiting for player... Refresh your browser to fully restart. if this takes too long"
        );
      }
    }, 1000);
  } else {
    setState("connectedPlayer", "ready");
    setState("connectedPlayerPower", playerOne.power);
    setState("connectedPlayerEnergy", 0);
    setState("connectedPlayerHealth", 100);
    let waiting = setInterval(() => {
      if (getState("hostPlayer") == "ready") {
        clearInterval(waiting);
        playerOne.scene.scene.start("Game", preData);
      } else if (getState("hostPlayer") == "left") {
        endingGameText.setText(
          "The other player left. Press escape to restart."
        );
      } else {
        endingGameText.setText(
          "Waiting for player... Press escape to restart if this takes too long"
        );
      }
    }, 1000);
  }
}
/**
 * Handles valid input from the player.
 * Removes the first letter from the current word, and moves on to the next letter.
 * If the current word has no more letters, generates a new word, adds new word to wordList and increases the players power level by one.
 * If the player reaches their max power level on that attack, they attack the other player.
 */
function validInput(player) {
  if (gameOver == true) return;
  player.curWord = player.curWord.substring(1);
  if (player.curWord.length == 0) {
    let newWord = getRandomWord();
    if (mode == "multi") {
      let list = getState("wordList");
      // generate new word
      list.push(newWord);
      setState("wordList", list);
      //get next word from list
      player.curWordIndex++;
      player.curWord = list[player.curWordIndex];
      player.energy++;
      if (isHost == true) setState("hostPlayerEnergy", player.energy);
      else setState("connectedPlayerEnergy", player.energy);

      if (player.energy == player.maxPower) {
        player.attack(player.target);
        player.energy = 0;
      }
    } else {
      // generate new word
      wordList.push(newWord);
      //get next word from list
      player.curWordIndex++;
      player.curWord = wordList[player.curWordIndex];
      player.energy++;
      if (player.energy == player.maxPower) {
        player.attack(player.target);
        player.energy = 0;
      }
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
