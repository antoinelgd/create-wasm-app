import { Game, Cell } from "wasm-snake";
import { memory } from "wasm-snake/wasm_snake_bg";
const GRID_COLOR = "#CCCCCC";
const CELL_SIZE = 15; // px
const AIR_COLOR = "#FFFFFF";
const SNAKE_COLOR = "#000000";
const FOOD_COLOR = "#fc0303";

const universe = Game.new();
const width = universe.width();
const height = universe.height();
const canvas = document.getElementById("snake-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;
const ctx = canvas.getContext("2d");

$(document).on("keypress", function (e) {
  if (
    e.originalEvent.key == "z" ||
    e.originalEvent.key == "q" ||
    e.originalEvent.key == "s" ||
    e.originalEvent.key == "d"
  ) {
    universe.change_direction(e.originalEvent.key);
  }
});

async function renderLoop() {
  universe.tick();

  drawGrid();
  drawGame();
  await sleep(100);
  requestAnimationFrame(renderLoop);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};
//bruh
const drawGame = () => {
  const cellsPtr = universe.field();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      if (cells[idx] === Cell.Snake) {
        ctx.fillStyle = SNAKE_COLOR;
      } else if (cells[idx] === Cell.Food) {
        ctx.fillStyle = FOOD_COLOR;
      } else {
        ctx.fillStyle = AIR_COLOR;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

drawGrid();
drawGame();
requestAnimationFrame(renderLoop);
