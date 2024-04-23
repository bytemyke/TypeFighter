export class Player extends Phaser.GameObjects.Sprite {
  energy = 0;
  health = 100;
  /* TODO: make the following variables dynamic based on fight later */
  dmg = 20;
  maxPower = 3;
  constructor(scene, power, x, y, curWord) {
    const route = "/assets/powers/" + power.name;
    super(scene, x, y, power.name + "init");
    this.scene = scene;
    this.power = power;
    this.maxPower = power.maxPower;
    this.x = x;
    this.y = y;
    this.setScale(1);
    scene.add.existing(this);
    this.setOrigin(1, 0);
    this.setDepth(3);
    this.dmg = power.dmg;
  }
  create() {
    // scene.add.existing(this);
    // this.setScale(6);
    // this.setOrigin(0.5, 0.5);
    // this.setDepth(3);
  }
  /**
   * Attack the target, reducing their health by the players damage.
   * @param {Object} target The target to attack.
   */
  attack(target) {
    if(this.power.name.toLowerCase() == "theft"){
      this.health += 2;
    }
    target.health -= this.dmg;
    if (target.health > 0) return;
    else {
      this.scene.gameOver(this);
    }
  }
}
