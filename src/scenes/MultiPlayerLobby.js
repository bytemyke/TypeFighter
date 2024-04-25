import { Scene } from "phaser";
import nipplejs from "nipplejs";
import {
  onPlayerJoin,
  insertCoin,
  isHost,
  myPlayer,
  setState,
} from "playroomkit";
import words from "../data/words.json";
const list = getWordList();
export class MultiPlayerLobby extends Scene {
  init(data) {
    this.mode = "multi";
    this.power = data.power;
  }
  constructor() {
    super("MultiPlayerLobby");
  }
  create() {
    // myPlayer().setState("health", 100);
    onPlayerJoin((playerState) => this.addPlayer(playerState));
    insertCoin({ gameId: "HoRqDTqmYaXZgFmQvyfV", maxPlayersPerRoom: 2 }).then(
      () => {
        if(isHost() == true){
          setState("wordList", list);
        }
        this.scene.start("Game", {
          power: this.power,
          mode: "multi",
          isHost: isHost(),
        });
      }
    );
  }
  addPlayer(playerState) {
    if (isHost()) {
      setState("hostPlayer", playerState);
      setState("hostPlayerPower", this.power);
      setState("hostPlayerEnergy", 0);
      setState("hostPlayerHealth", 100);
      setState("hostListFallback", list);
    } else {
      setState("connectedPlayer", playerState);
      setState("connectedPlayerPower", this.power);
      setState("connectedPlayerEnergy", 0);
      setState("connectedPlayerHealth", 100);
    }
  }
}
function getWordList() {
  let wordList = words.words;
  let myList = [];
  for (let i = 0; i < 10; i++) {
    myList.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return myList;
}
