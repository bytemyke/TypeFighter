/**
 * @fileoverview Player class for the game.
 * Displays the player sprite, and handles their animations and attacks.
 * @author Luis Rivera <luisrivera1994@gmail.com>
 */
import { flash } from "../functions/flash";
export class Player extends Phaser.GameObjects.Sprite {
  /**
   * Initial energy of the player.
   * @type {number}
   */
  energy = 0;
  /**
   * Initial health of the player.
   * @type {number}
   */
  health = 100;
  /**
   * Initial damage of the player.
   * @type {number}
   */
  dmg = 20;
  /**
   * Maximum amount of power the player can have.
   * @type {number}
   */
  maxPower = 3;
  /**
   * Construct the player object.
   * @param {Phaser.Scene} scene The scene the player belongs to.
   * @param {Object} power The power the player has.
   * @param {number} x The x coordinate of the player.
   * @param {number} y The y coordinate of the player.
   * @param {string} curWord The current word the player is typing.
   */
  constructor(scene, power, x, y, curWord) {
    const route = "/assets/powers/" + power.name;
    super(scene, x, y, power.name.toLowerCase() + "_idle");
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
  /**
   * Create the animations for the player.
   * @param {Object} power The power the player has.
   */
  create(power) {
    let playerCopy = this; // name should be copyOfPlayerForInsideOfCallbackFunctionBecauseJavascriptIsAnnoyingAndChangesThis
    let idleAnimationKey = power.name.toLowerCase() + "_idle";
    this.scene.anims.create({
      key: idleAnimationKey,
      frameRate: 24,
      frames: this.scene.anims.generateFrameNumbers(idleAnimationKey, {
        start: this.power.animations.idle.startFrame,
        end: this.power.animations.idle.endFrame,
      }),
      repeat: -1,
      yoyo: true,
    });
    // this.anims.hideOnComplete(true);
    this.anims.play(idleAnimationKey);

    this.on(
      "animationstop",
      function (animation, frame) {
        playerCopy.attackAnimation(playerCopy);
      },
      this.scene
    );
  }
  /**
   * Attack the target, reducing their health by the players damage.
   * @param {Object} target The target to attack.
   */
  attack(target) {
    flash(target, 0xff0000, 100);
    this.stop(); // stop the idle animation
    let dmg = this.dmg;
    /* theft special attribute */
    if (this.power.name.toLowerCase() == "theft") {
      this.health += 2;
    }
    /* Strength special attribute */
    if (target.power.name.toLowerCase() == "strength") {
      dmg = this.dmg - (20 / 100) * this.dmg;
    }

    target.health -= dmg;
    if (target.health > 0) return;
    else {
      this.scene.gameOver(this);
    }
  }
  /**
   * Animate the player attacking.
   * @param {Object} player The player attacking.
   */
  attackAnimation(player) {
    const playerFileExtension = player.power.name.toLowerCase();
    player.setVisible(false);
    player.setTexture(playerFileExtension + "_attack");
    let distance = {
      x: 250,
      y: 100,
    };
    //thief attack image is a bit too different
    if (playerFileExtension == "theft") {
      distance.y -= 120;
      player.setScale(1.5);
    }
    if (player.flipX == true) distance.x *= -1;
    player.x += distance.x;
    player.y += distance.y;
    player.setVisible(true);
    setTimeout(() => {
      if (playerFileExtension == "theft") player.setScale(1);
      player.setVisible(false);
      player.x -= distance.x;
      player.y -= distance.y;
      player.setTexture(playerFileExtension + "_idle");
      player.play(playerFileExtension + "_idle");
      player.setVisible(true);
    }, 500);
  }
}
