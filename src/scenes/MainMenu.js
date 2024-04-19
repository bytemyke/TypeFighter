import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }
  preload() {}

  create() {
    this.music = this.sound.add("fight_music", { volume: 0.5, loop: true });
    this.music.play();
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    // onPlayerJoin((playerState) => this.addPlayer(playerState));
    console.log(this.players);
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);

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

    var style = { font: "24px Arial", fill: "#ffffff", align: "center" };

    this.createButton(
      screenCenterX,
      screenCenterY - 100,
      "Instructions",
      "Instructions"
    );

    this.createButton(
      screenCenterX,
      screenCenterY + 100,
      "SinglePlayer",
      "ChoosePower",
      {
        mode: "single",
      }
    );

    this.createButton(
      screenCenterX,
      screenCenterY + 300,
      "MultiPlayer",
      "ChoosePower",
      {
        mode: "multi",
      }
    );
  }
  createButton(x, y, text, scene, sceneData) {
    this.anims.create({
      key: "on_button_hover",
      frames: this.anims.generateFrameNumbers("button", {
        start: 0,
        end: 14,
        first: 0,
      }),
      frameRate: 24,
      repeat: 0,
    });

    // this.anims.create({
    //   key: "off_button_hover",
    //   frames: this.anims.generateFrameNumbers("button", {
    //     start: 13,
    //     end: 23,
    //     first: 13,
    //   }),
    //   frameRate: 24,
    //   repeat: 0,
    // });
    const Button = this.add.container(
      [x],
      [y],
      [
        this.add
          .sprite(0, 0, "button")
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.scene.start(scene, sceneData))
          .on("pointerover", function (pointer) {
            this.play("on_button_hover");
          })
          .on("pointerout", function (pointer) {
            // this.stop("button_hover");
            this.anims.playReverse("on_button_hover");
          }),
        this.add.text(-120, -50, text, {
          fontFamily: '"Caveat"',
          fontSize: 60,
          color: "#7a7a7a",
          stroke: "#FFF",
          strokeThickness: 4,
        }),
      ]
    );
  }
}
