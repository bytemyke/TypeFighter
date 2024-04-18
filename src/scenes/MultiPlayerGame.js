import { Game } from "./Game";
import { Scene } from "phaser";
import nipplejs from "nipplejs";
import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";
export class MultiPlayerGame extends Scene {
  init(data) {
    this.players = data.players;
  }
  constructor() {
    super("MultiPlayerGame");
  }
  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    // onPlayerJoin((playerState) => this.addPlayer(playerState));
    console.log(this.players);
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);
  }

  update() {}
}
