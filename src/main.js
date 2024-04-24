/**
 * The entry point of the game.
 *
 * This file sets up the Phaser game configuration and instantiates the game.
 * It also sets up the scenes and provides a single
 * export for the game.
 */
import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { MultiPlayerLobby } from "./scenes/MultiPlayerLobby";
import { Preloader } from "./scenes/Preloader";
import { ChoosePower } from "./scenes/ChoosePower";
import { CpuDifficultySelector } from "./scenes/CpuDifficultySelector";
import { Instructions } from "./scenes/Instructions";

//Our game configuration
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  backgroundColor: "#222224",
  scale: {
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Instructions,
    ChoosePower,
    CpuDifficultySelector,
    MultiPlayerLobby,
    Game,
  ],
  //dev tip : use preloader / x, where x is the scene you want to test
  // scene: [ Preloader,Game],
};

export default new Phaser.Game(config);

