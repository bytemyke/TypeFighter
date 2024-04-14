// @ts-ignore - ignore import warning for the time being
import { Player } from "./Player";

/*
Difficulty options:
    1 - easy
    2 - average
    3 - above average
    4 - scholar


*/
export class Cpu extends Player {
  constructor(scene, playerType, x, y, width, height) {
    super(scene, playerType, x, y, width, height);
  }
}
