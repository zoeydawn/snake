import { Snake } from "./snake";
import * as w4 from "./wasm4";

// TODO: update the formatting and get rid of these damn simicolins

const snake = new Snake();
let frameCount = 0;

// const smiley = memory.data<u8>([
//   0b11000011, 0b10000001, 0b00100100, 0b00100100, 0b00000000, 0b00100100,
//   0b10011001, 0b11000011,
// ]);

export function update(): void {
  frameCount++;

  // speed control
  if (frameCount % 15 === 0) {
    snake.update();
  }
  snake.draw();
}

export function start(): void {
  store<u32>(w4.PALETTE, 0xfbf7f3, 0 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0xe5b083, 1 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0x426e5d, 2 * sizeof<u32>());
  store<u32>(w4.PALETTE, 0x20283d, 3 * sizeof<u32>());
}
