import { Scene } from "phaser";
import WebFontFile from "../classes/WebFontFile";
import powerData from "../data/power.json";
/**
 * Preloader scene. Loads all assets before starting the game
 */
export class Preloader extends Phaser.Scene {
  /**
   * Constructor method, sets name for the scene
   */
  constructor() {
    super("Preloader");
  }

  /**
   * Preload function. This is called when Phaser is ready to start loading assets
   */
  preload() {
    this.load.setPath("assets"); //set path for all assets
    // Display a loading bar
    const { width, height } = this.sys.game.scale.gameSize;
    const bar = this.add
      .rectangle(width / 2, height / 2 + 300, 468, 32, 0xffffff)
      .setStrokeStyle(1, 0xffffff)
      .setScale(0.5);
    // Update the progress bar when assets are loaded
    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
    // Phaser logo
    this.add.image(this.sys.game.scale.gameSize.width / 2, 384, "logo");
    // Load all assets
    this.loadAssets();
  }

  /**
   * Load all assets
   */
  loadAssets() {
    // Load all images (not relating to powers)
    this.loadImages();

    // Load all spritesheets (not relating to powers)
    this.loadSpritesheets();

    // Load all sounds
    this.loadSounds();

    // Load the font
    this.loadFonts();

    this.loadAllPowerAssets();
  }

  /**
   * Load all images
   */
  loadImages() {
    this.load.image("background", "bg.png");
    this.load.image("fight_background", "bg_fight.png");
    this.load.image("muted_audio", "font_awesome_icons/muted.svg");
    this.load.image("audio", "font_awesome_icons/audio.svg");
  }

  /**
   * Load all spritesheets
   */
  loadSpritesheets() {
    this.load.spritesheet("button", "button/button_hover.png", {
      frameWidth: 450,
      frameHeight: 200,
    });
  }

  /**
   * Load all spritesheets for powers
   */
  loadAllPowerAssets() {
    const powerData = require("../data/power.json");
    powerData.powers.forEach((power) => {
      const powerFileExtension = power.name.toLocaleLowerCase();
      this.load.image(
        `${power.name.toLocaleLowerCase()}_head`,
        `powers/${powerFileExtension}/sprite/${powerFileExtension}_head.png`,
        {
          frameWidth: 450,
          frameHeight: 650,
        }
      );

      this.load.image(
        `${power.name.toLocaleLowerCase()}_attack`,
        `powers/${powerFileExtension}/sprite/${powerFileExtension}_attack.png`,
        {
          frameWidth: 450,
          frameHeight: 650,
        }
      );
      /*Load all idle spritesheets for powers*/
      this.load.spritesheet(
        `${power.name.toLocaleLowerCase()}_idle`,
        `powers/${powerFileExtension}/sprite/${powerFileExtension}_idle.png`,
        {
          frameWidth: 450,
          frameHeight: 650,
        }
      );
    });
  }

  /**
   * Load all sounds
   */
  loadSounds() {
    this.load.audio("fight_music", "music/TIGERBL00D v2.ogg");
    this.load.audio("error", "sfx/error.wav");
  }

  /**
   * Load the font
   */
  loadFonts() {
    this.load.addFile(new WebFontFile(this.load, "Caveat"));
  }

  /**
   * Create function. This is called when all assets have loaded
   */
  create() {
    //play main music
    this.music = this.sound.add("fight_music", { volume: 0.5, loop: true });
    this.music.play();
    // Start the next scene
    this.scene.start("MainMenu");
    /*dev game testing*/
    // this.scene.start("Game", {
    //   difficulty: "2",
    //   mode: "single",
    //   power: powerData.powers[1],
    // });
  }
}
