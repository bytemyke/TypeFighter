/**
 * The ChoosePower scene is responsible for displaying the options for choosing a player's power.
 * When the user selects a power, the game is started with that power.
 */
import { Scene } from "phaser";
import powerData from "../data/power.json";
import { createButton } from "../functions/createButton";
import { createMuteOption } from "../functions/createMuteOption";

export class ChoosePower extends Scene {
  /**
   * The mode of the game, either single or multiplayer.
   */
  mode;

  /**
   * Set the mode of the game based on the data passed in from the previous scene.
   * @param {Object} data - The data passed in from the previous scene.
   */
  init(data) {
    data.mode == "single" || data.mode == "multi"
      ? (this.mode = data.mode)
      : (this.mode = "single");
  }

  /**
   * The constructor of the ChoosePower scene.
   */
  constructor() {
    super("ChoosePower");
  }

  /**
   * Creates the background, header, and power options of the scene.
   */
  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);
    let backButton = createButton(110, 100, "Back <---", this, "MainMenu", {});
    backButton.setScale(0.5);
    const header = this.add
      .text(screenCenterX, screenCenterY - 350, "CHOOSE YOUR POWER ", {
        fontFamily: '"Caveat"',
        fontSize: 200,
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
    createMuteOption(this);

  }

  /**
   * Starts the game with the selected power.
   * @param {Object} power - The selected power.
   */
  startGame(power) {
    this.mode == "single"
      ? this.scene.start("CpuDifficultySelector", {
          power: power,
          mode: "single",
        })
      : this.scene.start("MultiPlayerLobby", { power: power, mode: "multi" });
    return;
  }

  /**
   * Creates a power option container, which includes the power's name, description, and image.
   * @param {Phaser.Scene} scene - The scene that this power option will be added to.
   * @param {Object} power - The power object that describes the power.
   * @param {Number} cellWidth - The width of the cell that the power option will be placed in.
   * @param {Number} cellHeight - The height of the cell that the power option will be placed in.
   * @returns {Phaser.GameObjects.Container} - The power option container.
   */
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

    let dmg = scene.add
      .text(250, -100, "DMG : " + power.dmg + " ", {
        fontFamily: '"Caveat"',
        fontSize: 22,
        color: "#000000",
        stroke: "#FFF",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(1, 1);
    let maxPower = scene.add
      .text(250, -75, "Required Energy : " + power.maxPower + " ", {
        fontFamily: '"Caveat"',
        fontSize: 22,
        color: "#000000",
        stroke: "#FFF",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(1, 1);
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
        color: "#FFF",
        stroke: "#FFF",
        strokeThickness: 0.5,
        wordWrap: { width: cellWidth - 100, useAdvancedWrap: true },
      }
    );
    // startGame(power)
    powerOption.add([background, name, dmg, maxPower, avatarImg, description]);

    return powerOption;
  }
}
