import { Point, Snake } from './snake'
import * as w4 from './wasm4'

function rnd(n: i32 = 20): u16 {
  return u16(Math.floor(Math.random() * n))
}

const snake = new Snake()
let fruit = new Point(rnd(20), rnd(20))
let prevState: u8
let frameCount = 0
const fruitSprite = memory.data<u8>([
  0x00, 0xa0, 0x02, 0x00, 0x0e, 0xf0, 0x36, 0x5c, 0xd6, 0x57, 0xd5, 0x57, 0x35,
  0x5c, 0x0f, 0xf0,
])

// Move snake based on user input
function input(): void {
  const gamepad = load<u8>(w4.GAMEPAD1)
  const justPressed = gamepad & (gamepad ^ prevState)

  if (justPressed & w4.BUTTON_LEFT) {
    snake.left()
  }
  if (justPressed & w4.BUTTON_RIGHT) {
    snake.right()
  }
  if (justPressed & w4.BUTTON_UP) {
    snake.up()
  }
  if (justPressed & w4.BUTTON_DOWN) {
    snake.down()
  }

  prevState = gamepad
}

export function update(): void {
  frameCount++

  input()

  // speed control
  if (frameCount % 15 === 0) {
    snake.update()

    if (snake.isDead()) {
      // TODO: display "Game Over", the score, and a "play again" button
      snake.reset()
      w4.trace('dead!')
    }

    // detect collision with fruit
    if (snake.body[0].equals(fruit)) {
      let tail = snake.body[snake.body.length - 1]

      // grow the snake
      snake.body.push(new Point(tail.x, tail.y))

      // relocate the fruit
      // TODO: don't allow the fruit to spawn inside the snake
      fruit.x = rnd(20)
      fruit.y = rnd(20)
    }
  }
  snake.draw()

  // because we set the drawing colors, we need to change the drawing colors to:
  store<u16>(w4.DRAW_COLORS, 0x4320)
  // Blit draws a sprite at position `x`, `y` and uses DRAW_COLORS accordingly
  w4.blit(fruitSprite, fruit.x * 8, fruit.y * 8, 8, 8, w4.BLIT_2BPP)
}

export function start(): void {
  store<u32>(w4.PALETTE, 0xfbf7f3, 0 * sizeof<u32>())
  store<u32>(w4.PALETTE, 0xe5b083, 1 * sizeof<u32>())
  store<u32>(w4.PALETTE, 0x426e5d, 2 * sizeof<u32>())
  store<u32>(w4.PALETTE, 0x20283d, 3 * sizeof<u32>())
}

// TODO: add different levels

// To import PNG files:
// w4 png2src --assemblyscript file_name.png
// To import PNG file into a file (example):
// w4 png2src --assemblyscript fruit.png >> main.ts
// https://wasm4.org/docs/tutorials/snake/placing-the-fruit

// To bundle to HTML:
// w4 bundle build/cart.wasm --title "Snake" --html snake.html
// https://wasm4.org/docs/guides/distribution/#bundle-to-html

// Run in dev mode:
// w4 watch
// or
// w4 watch --no-open
