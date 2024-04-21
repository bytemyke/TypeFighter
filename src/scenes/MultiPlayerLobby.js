import { Scene } from "phaser";
import nipplejs from "nipplejs";
import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";
export class MultiPlayerLobby extends Scene {
  init(data) {
    this.mode = "multi";
    this.power = data.power;
  }
  players = [];
  constructor() {
    super("MultiPlayerLobby");
  }
  create() {
    console.log("in lobby");
    // myPlayer().setState("health", 100);
    onPlayerJoin((playerState) => this.addPlayer(playerState));
    console.log(this.players);
    insertCoin({ gameId: "HoRqDTqmYaXZgFmQvyfV", maxPlayersPerRoom: 2 }).then(
      () => {
        this.scene.start("Game", {
          power: this.power,
          mode: "multi",
          players: this.players,
          isHost: isHost(),
        });
      }
    );
  }
  addPlayer(playerState) {
    playerState.setState("health", 100);
    playerState.setState("energy", 0);
    console.log(playerState.getState("power"));
    console.log("running");
    this.players.push({
      power: this.power,
      health: 1,
      state: playerState,
      isHost: isHost(),
    });
    playerState.onQuit(() => {
      this.players = this.players.filter((p) => p.state !== playerState);
    });
  }
}
