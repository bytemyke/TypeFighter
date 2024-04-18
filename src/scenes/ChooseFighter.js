import { Scene } from "phaser";
export class ChooseFighter extends Scene {
  init(data) {
    this.mode = data.mode;
  }
  constructor() {
    super("ChooseFighter");
  }

  create() {
    this.playerLockedIn("multi");
  }

  playerLockedIn(player) {
    this.mode == "single"
      ? this.scene.start("SinglePlayerGame", { PlayerType: player })
      : this.scene.start("MultiPlayerLobby", { PlayerType: player });
    return;
  }
}
