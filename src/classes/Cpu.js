// @ts-ignore - ignore import warning for the time being
import { Player } from "./Player";

/*
Difficulty options:
    1 - easy
    3 - average
    6 - above average
    8 - scholar

*/
export class Cpu extends Player {
  difficulty = 1
  constructor(scene, playerType, x, y, width, height) {
    super(scene, playerType, x, y, width, height);
    this.scene = scene;
    this.writeWord();
  }
  writeWord() {
    console.log('starting writeWord')
    let speed = (Math.random() * 1000) + (1000 - (this.difficulty * 100));
    let counter = 0;
    setInterval(() => {
      console.log('starting loop')
      console.log(this.curWord)
      if(!this.curWord) return;
      counter += 1;
      // if (Math.random() * this.difficulty +1 < this.difficulty) {
        this.scene.cpuInput(this.curWord[0]);
      // } else{
      //   let rand = Math.floor(Math.random() * this.curWord.length);
      //   this.scene.cpuInput(this.curWord[rand]);
      // }
    }, speed);

  }
  translateDifficulty(Difficulty) {
    //switch to turn difficulty from string into an actual number?
  }
}
