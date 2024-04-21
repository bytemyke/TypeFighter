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
    let sprite = "";
    console.log("running");
    this.players.push({
      power: this.power,
      health: 1,
      state: playerState,
      sprite: sprite,
    });
    playerState.onQuit(() => {
      sprite.destroy();
      this.players = this.players.filter((p) => p.state !== playerState);
    });
  }
}
