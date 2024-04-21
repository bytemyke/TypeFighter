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
let mode = "single";
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
        mode = "multi";
        this.players = data.players;
        this.isHost = data.isHost;
        if (this.isHost == true) {
          this.MultiplayerWordList = wordList;
        }
      }
    }
  }
  constructor(title = "Game") {
    super(title);
  }
  create() {
    curWord = wordList[0];
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

    this.createPlayers(curWord);
    this.overlay.alpha = 0.25;

    this.cameras.main.setBackgroundColor(0x808080);

    console.log(this.sys.game.scale.gameSize);
    /*Create players and player assets (health bars, power bars)*/
    playerOne.target = playerTwo;
    playerTwo.target = playerOne;
    // let wordBackgorund = this.add.rectangle(
    //   screenCenterX,
    //   screenCenterY - 200,
    //   600,
    //   100,
    //   0x000000
    // );
    // wordBackgorund.alpha = 0.15;
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

    /* 
    Here we will create our watcher for keyboard input. We will use the handler function handleKeyboardInput() to decide what to do next.
    This does not need to be in the update method because we are creating a new watcher that will be constantly listening for input. 
    Thus, it only needs to be created once at the beginning of the game. 
    */

    //change variables for multiplayer
    if (this.mode == "multi") {
      const list = playerOne.multiplayerData.state.getState("wordList");
      wordList = list;
      playerOne.curWord = list[0];
      playerTwo.curWord = list[0];
      curWord = list[0];
    }
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
    this.timedEvent = this.time.delayedCall(
      4000,
      () => {
        wordBoard.setText(curWord);
        this.input.keyboard.on("keydown", handleKeyboardInput, this);
        gameOver = false;
      },
      [],
      this
    );
  }
  update() {
    if (gameOver == true) return;

    if (this.mode == "multi") {
      wordBoard.setText(playerOne.curWord); //constantly updates the display of the current word
      // updateMultiPlayerStats();
    } else {
      wordBoard.setText(playerOne.curWord); //constantly updates the display of the current word
      updatePlayerStats(playerOne);
      updatePlayerStats(playerTwo);
    }
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
  createPlayers(curWord) {
    if (this.mode == "multi") {
      // multiplayer = true;
      console.log(this.players);
      //if is host , then playerOne = player who is not host
      let playerOnePre;
      let playerTwoPre;
      if (this.isHost == true) {
        if (this.players[0].isHost == true) {
          playerOnePre = this.players[0];
          playerTwoPre = this.players[1];
        } else {
          playerOnePre = this.players[1];
          playerTwoPre = this.players[0];
        }
        console.log(playerTwoPre.power);
      }
      //if !host , then playerOne = player who is not host
      else {
        if (this.players[0].isHost == false) {
          playerOnePre = this.players[0];
          playerTwoPre = this.players[1];
        } else {
          playerOnePre = this.players[1];
          playerTwoPre = this.players[0];
        }
      }

      playerOne = createPlayer(this, this.power, 470, 390, curWord, true);
      playerTwo = createPlayer(
        this,
        playerTwoPre.power,
        900,
        390,
        curWord,
        true
      );
      playerOne.multiplayerData = playerOnePre;
      playerTwo.multiplayerData = playerTwoPre;
      console.log(playerOne);
      console.log(playerTwo);
      //if its the host set the word list for both players
      playerOne.multiplayerData.state.setState(
        "wordList",
        this.MultiplayerWordList
      );
      playerTwo.multiplayerData.state.setState(
        "wordList",
        this.MultiplayerWordList
      );
      console.log(playerOne.multiplayerData.state);
      console.log(playerTwo.multiplayerData.state);
    } else {
      playerOne = createPlayer(this, this.power, 470, 390, curWord, true);
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

function createPlayer(scene, power, x, y, curWord, firstPlayer) {
  console.log(curWord);
  const player = new Player(scene, power, x, y, curWord);
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
    100,
    200,
    20,
    200,
    0xffffff,
    player.maxPower
  )),
    player.powerBar.create();
  player.curWord = curWord;
  player.curWordIndex = 0;
  return player;
}
function createCpu(scene, power, x, y, curWord) {
  const cpu = new Cpu(scene, power, x, y, curWord, false);
  cpu.healthBar = new HealthBar(scene, x / 2.5, 100, 400, 30, 0xffffff);
  cpu.healthBar.create();
  cpu.powerBar = new PowerBar(
    scene,
    x / 2.5 + 180,
    200,
    20,
    200,
    0xffffff,
    cpu.maxPower
  );
  cpu.powerBar.create();
  cpu.curWord = curWord;
  cpu.curWordIndex = 0;
  return cpu;
}

function updatePlayerStats(player) {
  // console.log(player.healthBar);
  // console.log(player.curWord);
  player.healthBar.updateGraphics(player.health);
  player.powerBar.updateGraphics(player.energy);
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
  player.energy = 0;
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
    let newWord = getRandomWord();
    if (mode == "multi") {
      let list = player.multiplayerData.state.getState("wordList");
      // generate new word
      list.push(newWord);
      playerOne.multiplayerData.state.setState("wordList", list);
      playerTwo.multiplayerData.state.setState("wordList", list);
      //get next word from list
      player.curWordIndex++;
      player.curWord = list[player.curWordIndex];
      player.energy++;
      console.log(player.energy, player.maxPower);
      if (player.energy == player.maxPower) {
        console.log("max");
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
      console.log(player.energy, player.maxPower);
      if (player.energy == player.maxPower) {
        console.log("max");
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
