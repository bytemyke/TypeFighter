import { Scene } from "phaser";
import powerData from "../data/power.json";
export class ChoosePower extends Scene {
  init(data) {
    data.mode == "single" || data.mode == "multi"
      ? (this.mode = data.mode)
      : (this.mode = "single");
  }
  constructor() {
    super("ChoosePower");
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);
    const header = this.add
      .text(screenCenterX, screenCenterY - 350, "CHOOSE YOUR POWER ", {
        fontFamily: '"Caveat"',
        fontSize: 200,
        color: "#7a7a7a",
        stroke: "#FFF",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5);
    const x = 600;
    const y = 350;
    const gridW = 1100;
    const gridH = 619;
    const cellWidth = gridW / 2;
    const cellHeight = gridH / 2;

    let powers = [];
    powerData.powers.forEach((power) =>
      powers.push(this.CreatePowerOption(this, power, cellWidth, cellHeight))
    );

    //Create Grid
    Phaser.Actions.GridAlign(powers, {
      width: gridH,
      height: gridW,
      cellWidth: gridW / 2,
      cellHeight: gridH / 2,
      x: screenCenterX - cellWidth,
      y: screenCenterY + 100 - cellHeight,
    });
  }

  startGame(power) {
    this.mode == "single"
      ? this.scene.start("Game", { power: power, mode: "single" })
      : this.scene.start("Game", { power: power, mode: "multi" });
    return;
  }

  CreatePowerOption(scene, power, cellWidth, cellHeight) {
    const background = scene.add
      .rectangle(0, 0, cellWidth - 40, cellHeight - 40, 0x222224)
      .setStrokeStyle(2, 0x000000);
    const powerOption = scene.add.container(0, 0);
    const avatarImg = scene.add.image(
      -cellWidth / 4,
      -(cellHeight - 50) / 4,
      power.name + "head"
    );
    let name = scene.add
      .text(0, -100, power.name + " ", {
        fontFamily: '"Caveat"',
        fontSize: 50,
        color: "#000000",
        stroke: "#FFF",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    powerOption
      .setSize(cellWidth - 40, cellHeight - 40)
      .setInteractive()
      .on("pointerdown", () => this.startGame(power))
      .on("pointerover", function (pointer) {
        powerOption.alpha = 0.5;
      })
      .on("pointerout", function (pointer) {
        powerOption.alpha = 1;
      });
    const description = scene.add.text(
      -(cellWidth - 80) / 2,
      40,
      power.description,
      {
        fontFamily: '"Caveat"',
        fontSize: 28,
        color: "#000000",
        stroke: "#FFF",
        strokeThickness: 4,
        wordWrap: { width: cellWidth - 100, useAdvancedWrap: true },
      }
    );
    // startGame(power)
    powerOption.add([background, name, avatarImg, description]);

    return powerOption;
  }
}
