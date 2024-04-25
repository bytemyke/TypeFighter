import { Scene } from "phaser";
/*The initial scene of the game. Used to load any assets needed for the preloader scene (loading screen)*/
export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //load images used in preloader
    this.load.image("logo", "assets/logo.png");
  }

  create() {
    this.scene.start("Preloader");
  }
}
