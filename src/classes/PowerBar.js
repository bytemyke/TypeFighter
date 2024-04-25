/**
 * Class that represents a power bar that displays the player's remaining energy.
 * The power bar is a rectangular bar that is filled with a specified color
 * to show how much energy the player has left.
 *
 * The class has a create() method that is called by the scene to create the
 * power bar. It also has an updateGraphics() method that is called whenever
 * the player's energy changes to update the power bar's visual appearance.
 *
 * The class also has a setWidth() method that can be used to change the width
 * of the power bar. This is used by the scene to update the power bar's width
 * when the player's health changes.
 */
export class PowerBar {
  /**
   * Creates a PowerBar object.
   *
   * @param {Phaser.Scene} scene - The scene that this power bar will be added to.
   * @param {Number} x - The horizontal position of the power bar.
   * @param {Number} y - The vertical position of the power bar.
   * @param {Number} height - The height of the power bar.
   * @param {Number} width - The width of the power bar.
   * @param {Number} fillColor - The color that the power bar should be filled with.
   * @param {Number} maxPower - The maximum amount of energy that the player can have.
   */
  constructor(scene, x, y, height, width, fillColor, maxPower) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.maxPower = maxPower;
  }

  /**
   * Creates the power bar and adds it to the scene.
   */
  create() {
    //Create bar
    this.bar = this.scene.add.rectangle(
      this.x + this.width / 2,
      this.y,
      this.width * 2,
      this.height,
      this.fillColor
    );
    this.bar.alpha = 0.9;
    this.barContainer = this.scene.add.container(this.x, this.y);
    //Create bar outline
    const style = { font: "30px Caveat", fill: "#ffffff", align: "center" };
    this.energyText = this.scene.add.text(
      this.x - 210,
      this.y - 12,
      "Energy : 0/" + this.maxPower + " ",
      style
    );
    this.energyText.setOrigin(0);
    this.BarOutline = this.scene.add
      .rectangle(this.x + this.width / 2, this.y, this.width * 2, this.height)
      .setStrokeStyle(4, 0x000000);
    this.barContainer.add([this.bar, this.energyText, this.BarOutline]);
    this.oldW = this.width * 2;
    this.oldX = this.x + this.width / 2;
    this.BarOutline.alpha = 0.9;
    this.oldEnergy = 0;
    this.oldW = this.width;
    this.oldX = this.x + this.width;
    this.bar.width = 0;
  }
  /**
   * Updates the visual appearance of the power bar based on the player's current energy.
   *
   * @param {Number} energy - The player's current energy.
   */
  updateGraphics(energy) {
    this.energyText.setText("Energy : " + energy + "/" + this.maxPower + " ");
    if (this.oldEnergy !== energy) {
      this.oldEnergy = energy;
      let stepWidth = energy / this.maxPower;
      let displayW = stepWidth * this.BarOutline.width;
      this.bar.width = displayW;
    }
    return;
  }

  /**
   * Changes the width of the power bar.
   *
   * @param {Number} newWidth - The new width of the power bar.
   */
  setWidth(newWidth) {
    this.width = newWidth;
    this.updateGraphics();
  }
}
