import { Scene } from "phaser";
import { createButton } from "../functions/createButton";
import { createMuteOption } from "../functions/createMuteOption";

//{ power: power, mode: "single" }
export class CpuDifficultySelector extends Scene {
  init(data) {
    data.mode == "single" || data.mode == "multi"
      ? (this.mode = data.mode)
      : (this.mode = "single");
    this.power = data.power;
  }
  constructor() {
    super("CpuDifficultySelector");
  }
  create() {
    console.log("creating CpuDifficultySelector");
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);
    const header = this.add
      .text(screenCenterX, screenCenterY - 350, "CHOSE YOUR DIFFICULTY ", {
        fontFamily: '"Caveat"',
        fontSize: 180,
        color: "#7a7a7a",
        stroke: "#FFF",
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    const x = 600;
    const y = 350;
    const gridW = 1100;
    const gridH = 619;
    const cellWidth = gridW / 2;
    const cellHeight = gridH / 2;
    let options = ["Laughable ", "Moderate ", "Powerful ", "Good Luck lol "];
    const buttons = [];
    for (let i = 1; i <= 4; i++) {
      const button = createButton(
        screenCenterX,
        screenCenterY + 100 - cellHeight * i,
        options[i - 1],
        this,
        "Game",
        {
          mode: "single",
          power: this.power,
          difficulty: i,
        }
      );
      buttons.push(button);
    }
    //Create Grid
    Phaser.Actions.GridAlign(buttons, {
      width: gridH,
      height: gridW,
      cellWidth: gridW / 2 - 100,
      cellHeight: gridH,
      x: cellWidth / 2,
      y: screenCenterY + 300 - cellHeight,
    });
    createMuteOption(this);

  }
}
