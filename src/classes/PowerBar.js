export class PowerBar {
  text;
  constructor(scene, x, y, width, height, fillColor, maxPower) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.maxPower = maxPower;
  }

  create() {
    // this.bar = this.scene.add.graphics();
    // const style = { font: "24px Arial", fill: "#ffffff", align: "center" };
    // this.text = this.scene.add.text(this.x, this.y - 30, "100%", style);
    // this.text.setOrigin(0, 0.5);
    this.bar = this.scene.add.rectangle(
      this.x + this.width / 2,
      this.y + 50,
      this.width * 2,
      this.height,
      0xffffff
    );
    this.bar.alpha = 0.9;
    this.barContainer = this.scene.add.container(this.x, this.y);
    const style = { font: "24px Arial", fill: "#ffffff", align: "center" };
    this.text = this.scene.add.text(this.x, this.y - 100, 0, style);
    this.text.setOrigin(0);
    this.BarOutline = this.scene.add
      .rectangle(
        this.x + this.width / 2,
        this.y + 50,
        this.width * 2,
        this.height
      )
      .setStrokeStyle(4, 0x000000);
    this.barContainer.add([this.bar, this.text, this.BarOutline]);
    this.oldHealth = 100;
    this.oldW = this.width * 2;
    this.oldX = this.x + this.width / 2;
    this.BarOutline.alpha = 0.9;
    //TODO: Make this work. Want to add lines per percentage of 1 to the bar. Also will fill per percent in the updateGraphics function
    for (let i = 0; i < this.maxPower; i++) {
      let percentage = ((i + 1) / this.maxPower) * this.bar.height;
      console.log(percentage);
    }
  }
  updateGraphics(energy) {
    this.text.setText(energy);
    // this.bar.clear();
    // this.bar.fillStyle(this.fillColor, 1);
    // this.bar.fillRect(this.x, this.y, this.width, this.height);
  }

  setWidth(newWidth) {
    this.width = newWidth;
    this.updateGraphics();
  }
}
