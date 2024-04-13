export class Player {
  power = 0;
  maxPower = 3; // TODO: make dynamic based on fight later
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
