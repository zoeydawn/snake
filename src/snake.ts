import * as w4 from "./wasm4";

export class Point {
  constructor(public x: i32, public y: i32) {}

  equals(other: Point): bool {
    return this.x == other.x && this.y == other.y;
  }
}

export class Snake {
  body: Array<Point> = [new Point(2, 0), new Point(1, 0), new Point(0, 0)];
  direction: Point = new Point(1, 0);

  draw(): void {
    store<u16>(w4.DRAW_COLORS, 0x0043);
    this.body.forEach((part) => w4.rect(part.x * 8, part.y * 8, 8, 8));

    store<u16>(w4.DRAW_COLORS, 0x0004);
    w4.rect(this.body[0].x * 8, this.body[0].y * 8, 8, 8);
  }

  update(): void {
    const body = this.body;
    // draw the snake
    for (let i = body.length - 1; i > 0; i--) {
      unchecked((body[i].x = body[i - 1].x));
      unchecked((body[i].y = body[i - 1].y));
    }

    // head movement
    body[0].x = (body[0].x + this.direction.x) % 20;
    body[0].y = (body[0].y + this.direction.y) % 20;

    if (body[0].x < 0) {
      body[0].x = 19;
    }
    if (body[0].y < 0) {
      body[0].y = 19;
    }
  }

  isDead(): bool {
    const head = this.body[0];

    for (let i = 1, len = this.body.length; i < len; i++) {
      if (this.body[i].equals(head)) {
        return true;
      }
    }

    return false;
  }

  reset(): void {
    this.body = [new Point(2, 0), new Point(1, 0), new Point(0, 0)];
    this.direction = new Point(1, 0);
  }

  left(): void {
    // w4.trace("left");

    if (this.direction.x == 0) {
      this.direction.x = -1;
      this.direction.y = 0;
    }
  }

  right(): void {
    // w4.trace("right");

    if (this.direction.x == 0) {
      this.direction.x = 1;
      this.direction.y = 0;
    }
  }

  up(): void {
    // w4.trace("up");

    if (this.direction.y == 0) {
      this.direction.x = 0;
      this.direction.y = -1;
    }
  }

  down(): void {
    // w4.trace("down");

    if (this.direction.y == 0) {
      this.direction.x = 0;
      this.direction.y = 1;
    }
  }
}
