/**
 * Class representing a health bar for a player.
 * 
 * The health bar is a rectangular bar that is filled with a specified color
 * to show the player's health. The class has a create() method that is called
 * by the scene to create the health bar. It also has an updateGraphics() method
 * that is called whenever the player's health changes to update the health
 * bar's visual appearance.
 * 
 * The class also has a setWidth() method that can be used to change the width
 * of the health bar. This is used by the scene to update the health bar's width
 * when the player's health changes.
 */
export class HealthBar {
  text;
  /**
   * Creates a new health bar.
   * 
   * @param {Phaser.Scene} scene - The scene that the health bar belongs to.
   * @param {number} x - The X position of the health bar.
   * @param {number} y - The Y position of the health bar.
   * @param {number} width - The width of the health bar.
   * @param {number} height - The height of the health bar.
   * @param {number} fillColor - The color of the health bar when it is full
   *        (i.e. when the player's health is 100%).
   * @param {boolean} firstPlayer - Whether this health bar is for the first
   *        player or not. This is used to position the health bar correctly.
   */
  constructor(scene, x, y, width, height, fillColor, firstPlayer) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.firstPlayer = firstPlayer;
  }

  create() {
    const style = { font: "30px Caveat", fill: "#ffffff", align: "center" };
    this.bar = this.scene.add.rectangle(
      this.x + this.width / 2,
      this.y,
      this.width,
      this.height,
      this.fillColor
    );
    this.bar.alpha = 0.8;
    this.barContainer = this.scene.add.container(this.x, this.y);
    this.text = this.scene.add.text(this.x, this.y - 50, "Health : 100% ", style);
    this.text.setOrigin(0);
    this.BarOutline = this.scene.add
      .rectangle(this.x + this.width / 2, this.y, this.width, this.height)
      .setStrokeStyle(8, 0x000000);
    this.barContainer.add([this.bar, this.text, this.BarOutline]);
    this.oldHealth = 100;
    this.oldW = this.width;
    this.oldX = this.x + this.width / 2;
    this.BarOutline.alpha = 0.9;
  }
  /**
   * Updates the visual appearance of the health bar based on the player's
   * current health.
   * 
   * @param {number} health - The player's current health.
   */
  updateGraphics(health) {
    this.text.setText("Health : " + health + "%");
    if (health < this.oldHealth) {
      this.oldHealth = health;
      let stepWidth = ((100 - health) / 100) * this.oldW;
      this.bar.width = this.oldW - stepWidth;
      this.bar.x = this.oldX + stepWidth;
      return;
    }
  }

  /**
   * Changes the width of the health bar.
   * 
   * @param {number} newWidth - The new width of the health bar.
   */
  setWidth(newWidth) {
    this.width = newWidth;
    this.updateGraphics();
  }
}

