export class Player extends Phaser.GameObjects.Sprite {
  power = 0;
  health = 100;
  /* TODO: make the following variables dynamic based on fight later */
  dmg = 120;
  maxPower = 3;
  constructor(scene, playerType, x, y, width, height) {
    super(scene, x, y, playerType + "init");
    this.scene = scene;
    this.playerType = playerType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    scene.add.existing(this);
    this.setScale(8);
    this.setOrigin(1, 0);
    this.setDepth(3);
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
    target.health -= this.dmg;
    if (target.health > 0) return;
    else {
      this.scene.gameOver(this);
    }
  }
}
