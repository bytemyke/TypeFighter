// Cpu class
// 
// @file
// @module
// @class Cpu
// @classdesc Cpu class extends Player and handles CPU AI typing
// @author Joshua Eder

// Import dependencies
import { Player } from "./Player";
export class Cpu extends Player {
  /**
   * difficulty of the CPU player
   * Options : 1,2,3,4
   * @type {number}
   */
  difficulty = 1
  /**
   * can the CPU input text?
   * @type {boolean}
   */
  canInput = true
  /**
   * constructor for the CPU class
   * @constructor
   * @param {Phaser.Scene} scene - The current scene
   * @param {string} power - The selected power
   * @param {number} x - The x position of the player
   * @param {number} y - The y position of the player
   * @param {number} width - The width of the player
   * @param {number} height - The height of the player
   * @param {number} difficulty - The difficulty of the CPU player
   */
  constructor(scene, power, x, y, width, height, difficulty) {
    console.log('cpu created');
    super(scene, power, x, y, width, height);
    console.log("cpu power ", power);
    this.power = power;
    this.difficulty = difficulty;
    this.scene = scene;
    this.writeWord();
  }
  /**
   * Write a word for the CPU to type
   * @method
   */
  writeWord() {
    console.log('starting writeWord')
    let CPM = translateDifficulty(this.difficulty);
    // CPM += 50; //They all are a bit too weak. Might need to be adjusted.
    let ms = 60000 / CPM;
    this.interval = setInterval(() => {
      if(!this.curWord || this.gameOver == true) return;
      if(this.canInput == true)
        this.scene.cpuInput(this.curWord[0]);
    }, ms);
  }

}
/**
 * Translate the difficulty to a character per minute
 * @param {number} difficulty - The difficulty of the CPU player
 * @returns {number} - The CPM of the CPU player
 */
function translateDifficulty(difficulty) {
  //basing CPM based on data from https://www.typingpal.com/en/documentation/school-edition/pedagogical-resources/typing-speed
  switch (difficulty) {
    case 1: return Phaser.Math.Between(50, 100);
    case 2: return Phaser.Math.Between(150, 300);
    case 3: return Phaser.Math.Between(500, 750);
    case 4: return Phaser.Math.Between(800, 900);
    default: return 200;
  }

}
