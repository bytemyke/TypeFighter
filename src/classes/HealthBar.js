export class HealthBar {
  text;
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
    this.bar = this.scene.add.rectangle(
      this.x + this.width / 2,
      this.y,
      this.width,
      this.height,
      0xffffff
    );
    this.barContainer = this.scene.add.container(this.x, this.y);
    const style = { font: "24px Arial", fill: "#ffffff", align: "center" };
    this.text = this.scene.add.text(this.x, this.y - 50, "100%", style);
    this.text.setOrigin(0);
    this.BarOutline = this.scene.add
      .rectangle(this.x + this.width / 2, this.y, this.width, this.height)
      .setStrokeStyle(8, 0x000000);
    this.barContainer.add([this.bar, this.text, this.BarOutline]);
    this.oldHealth = 100;
    this.oldW = this.width;
    this.oldX = this.x + this.width / 2;
  }
  updateGraphics(health) {
    this.text.setText(health + "%");
    if (health < this.oldHealth) {
      this.oldHealth = health;
      let stepWidth = ((100 - health) / 100) * this.oldW;
      console.log(
        "HEALTH: " + health,
        "OLD " + this.oldW,
        100 - health,
        (100 - health) / 100,
        stepWidth + " HERRRE"
      );

      this.bar.width = this.oldW - stepWidth;
      this.bar.x = this.oldX + stepWidth;

      return;
    }
  }

  setWidth(newWidth) {
    this.width = newWidth;
    this.updateGraphics();
  }
}
