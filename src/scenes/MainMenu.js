import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
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

    // Based on your game size, it may "stretch" and distort.
    // this.background.displayWidth = this.sys.canvas.width;
    // this.background.displayHeight = this.sys.canvas.height;
    

    this.add
      .text(screenCenterX, 80, "TypeFighter", {
        fontFamily: "Arial Black",
        fontSize: 56,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 40,
        align: "left",
      })
      .setOrigin(0);


    // this.add.image(512, 300, "logo");

    this.add
      .text(512, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    var style = { font: "24px Arial", fill: "#ffffff", align: "center" };

    var button1 = this.add.text(512, 420, "Single Player", style);
    button1
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("ChooseFighter"),  {mode: "single"});

    var button2 = this.add.text(512 - 300, 420, "Multiplayer", style);
    button2
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("ChooseFighter"), {mode: "multi"});

    var button3 = this.add.text(512 + 150, 420, "Instructions", style);
    button3
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Instructions"));
  }
}
