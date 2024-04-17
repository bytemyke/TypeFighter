export class HealthBar {
  text;
  constructor(scene, x, y, width, height, fillColor) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
  }

  create() {
    this.bar = this.scene.add.graphics();
    const style = { font: "24px Arial", fill: "#ffffff", align: "center" };
    this.text = this.scene.add.text(this.x, this.y - 30, "100%", style);
    this.text.setOrigin(0, 0.5);
  }
  updateGraphics(health) {
    this.text.setText(health + "%");
    this.bar.clear();
    this.bar.fillStyle(this.fillColor, 1);
    this.bar.fillRect(this.x, this.y, this.width, this.height);
  }

  setWidth(newWidth) {
    this.width = newWidth;
    this.updateGraphics();
  }
}
