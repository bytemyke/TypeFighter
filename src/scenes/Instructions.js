import { Scene } from "phaser";
import { createButton } from "../functions/createButton";
import { createMuteOption } from "../functions/createMuteOption";

export class Instructions extends Scene {
  constructor() {
    super("Instructions");
  }
  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.background = this.add
      .image(screenCenterX, screenCenterY, "background")
      .setOrigin(0.5);
      this.overlay = this.add
      .rectangle(
        screenCenterX,
        screenCenterY,
        this.background.displayWidth,
        this.background.displayHeight,
        0xFAF9F6
      )
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5);

    this.overlay.alpha = 0.3;

      const subHeaderStyle = { font: "80px Caveat", fill: "#7a7a7a", align: "center", stroke: "#FFF",
        strokeThickness: 4};
      const paragraphStyle = { font: "30px Caveat", fill: "#1E1F21", align: "center" };
      const x = 2;
      let backButton = createButton(110,100, "Back <---", this, "MainMenu", {});
      backButton.setScale(0.5);
      let headerOne = this.add.text(screenCenterX, screenCenterY - 350, "INSTRUCTIONS", {
        fontFamily: '"Caveat"',
        fontSize: 200,
        color: "#7a7a7a",
        stroke: "#FFF",
        strokeThickness: 6,
      }).setOrigin(0.5, 0.5);
      this.createSection(screenCenterX, screenCenterY - 200,100, "BASICS : ", subHeaderStyle, `
      This is a fighting game. There are ${x} different Powers you can choose from. Each Power requires a different amount of energy and does a different ammount of damage.
      Correctly typing 1 word will increase your energy by 1. However, typing a character incorrectly will reduce your energy down to 0. Thus, accuracy is VERY important.
      Once your energy bar is full, you will use your power. Some powers have special effects (theft steals 2 health from the opponent).
      `,paragraphStyle)

      this.createSection(screenCenterX, screenCenterY, 220 ,"Multi Player : ", subHeaderStyle, `
        For MultiPlayer mode, this game uses a basic Playroom.js lobby system. This means that you will need to have someone you can invite to your lobby.
        This mode is comprised of only two people, the host and the connected player.

        HOSTING:
        If you are hosting, click the multiplayer button in the main menu and then select your power. In the lobby window, click "Invite", then "Share", then "Copy".
        Now, send your invite link to the other player. This is a special link, thus, they must access the game from the shared link. They can not join the 
        multiplayer session from the base Itch.io game page. Once they join, you may launch the game once they join.

        JOINING:
        In order to join a multiplayer session, first access the game from the shared link the host gave you. Then, click the multiplayer button. 
        Then choose your power. You should now be in the lobby. You can not launch the game, and must wait for the host to do so. 
      `,paragraphStyle)

      createMuteOption(this);
  }
  createSection(x,y,space,title,titleStyle,paragraph,paragraphStyle){
    this.add.text(x, y, title, titleStyle).setOrigin(0.5);
    this.add.text(x, y + space, paragraph, paragraphStyle).setOrigin(0.5);
  }

}
