import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { MultiPlayerLobby } from "./scenes/MultiPlayerLobby";
import { Preloader } from "./scenes/Preloader";
import { ChoosePower } from "./scenes/ChoosePower";
import { CpuDifficultySelector } from "./scenes/CpuDifficultySelector";
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
// const config = {
//   type: Phaser.AUTO,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   parent: "game-container",
//   backgroundColor: "#028af8",
//   scale: {
//     // mode: Phaser.Scale.FIT,
//     autoCenter: Phaser.Scale.CENTER_BOTH,
//   },
//   scene: [Boot, Preloader, MainMenu, Game, Multiplayer],
// };
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
    CpuDifficultySelector,
    MultiPlayerLobby,
    Game,
    ChoosePower,
  ],
  // scene: [ Preloader,Game],
};
// 1280x720
// width: window.innerWidth,
// height: window.innerHeight,
export default new Phaser.Game(config);
