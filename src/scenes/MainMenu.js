/**
 * The main menu scene is the first scene that is displayed when the game is loaded.
 * It contains buttons to navigate to other scenes (instructions and choose power).
 * 
 * @author Calvin Huang <calvin.huang@gmail.com>
 */

import { Scene } from "phaser";
import { createButton } from "../functions/createButton";
export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }
  
  /**
   * Creates the background, header, and button options of the scene.
   */
  create() {
    this.music = this.sound.add("fight_music", { volume: 0.5, loop: true });
    this.music.play();
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);

    this.add
      .text(screenCenterX, 200, "TypeFighter ", {
        fontFamily: "Caveat",
        fontSize: 200,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 40,
        align: "center",
      })
      .setOrigin(0.5);

    createButton(
      screenCenterX,
      screenCenterY - 100,
      "Instructions",
      this,
      "Instructions"
    );

    createButton(
      screenCenterX,
      screenCenterY + 100,
      "SinglePlayer",
      this,
      "ChoosePower",
      {
        mode: "single",
      }
    );

    createButton(
      screenCenterX,
      screenCenterY + 300,
      "MultiPlayer",
      this,
      "ChoosePower",
      {
        mode: "multi",
      }
    );
  }

}

