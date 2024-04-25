import { Scene } from "phaser";
import WebFontFile from "../classes/WebFontFile";
import powerData from "../data/power.json";
export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Phaser logo
    this.add.image(this.sys.game.scale.gameSize.width / 2, 384, "logo");
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add
      .rectangle(
        this.sys.game.scale.gameSize.width / 2,
        this.sys.game.scale.gameSize.height / 2 + 300,
        468,
        32
      )
      .setStrokeStyle(1, 0xffffff)
      .setScale(0.5);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add
      .rectangle(
        this.sys.game.scale.gameSize.width / 2 - 230,
        this.sys.game.scale.gameSize.height / 2 + 300,
        4,
        28,
        0xffffff
      )
      .setScale(0.5);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("background", "bg.png");
    this.load.image("fight_background", "bg_fight.png");
    this.load.image("muted_audio", "font_awesome_icons/muted.svg");
    this.load.image("audio", "font_awesome_icons/audio.svg");
    this.load.spritesheet("button", "button/button_hover.png", {
      frameWidth: 450,
      frameHeight: 200,
    });
    this.load.addFile(new WebFontFile(this.load, "Caveat"));
    powerData.powers.forEach((power) => {
      const powerFileExtension = power.name.toLowerCase();
      this.load.image(
        power.name + "head",
        "powers/" +
          powerFileExtension +
          "/sprite/" +
          powerFileExtension +
          "_head.png"
      );
    });
    /*Load all spritesheets for powers*/
    this.load.spritesheet(
      "sorcery_idle",
      "powers/sorcery/sprite/sorcery_idle.png",
      {
        frameWidth: 450,
        frameHeight: 650,
      }
    );
    this.load.spritesheet("theft_idle", "powers/theft/sprite/theft_idle.png", {
      frameWidth: 450,
      frameHeight: 650,
    });
    this.load.spritesheet(
      "strength_idle",
      "powers/strength/sprite/strength_idle.png",
      {
        frameWidth: 450,
        frameHeight: 650,
      }
    );
    this.load.audio("menu_music", "music/5ARDINNE.ogg");
    this.load.audio("fight_music", "music/TIGERBL00D v2.ogg");
    this.load.audio("error", "sfx/error.wav");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    this.music = this.sound.add("fight_music", { volume: 0.5, loop: true });
    this.music.play();
    //  set a small timeout so that loading screen can be seen
    this.scene.start("MainMenu");

    // this.scene.start("CpuDifficultySelector");
  }
}
