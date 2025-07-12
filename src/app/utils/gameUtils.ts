import { Position, Obstacle, GRID_SIZE, Food } from "../types/game";

const OBSTACLE_SHAPES = [
  // Line shapes
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ],
  // L shapes
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // T shapes
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 1 },
  ],
  // Square
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // Z shapes
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
];

export function generateObstacle(
  snake: Position[],
  food: Position,
  obstacles: Obstacle[],
  gridWidth: number,
  gridHeight: number
): Obstacle {
  const shape =
    OBSTACLE_SHAPES[Math.floor(Math.random() * OBSTACLE_SHAPES.length)];
  const maxX = gridWidth - Math.max(...shape.map((p) => p.x)) - 1;
  const maxY = gridHeight - Math.max(...shape.map((p) => p.y)) - 1;

  let baseX: number, baseY: number;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    baseX = Math.floor(Math.random() * (maxX + 1));
    baseY = Math.floor(Math.random() * (maxY + 1));
    attempts++;
  } while (
    attempts < maxAttempts &&
    shape.some((offset) => {
      const pos = { x: baseX + offset.x, y: baseY + offset.y };
      // Check distance from snake head (at least 5 units away)
      const distanceFromSnake =
        Math.abs(pos.x - snake[0].x) + Math.abs(pos.y - snake[0].y);
      if (distanceFromSnake < 5) return true;

      // Check if overlaps with snake, food, or other obstacles
      return (
        snake.some((segment) => segment.x === pos.x && segment.y === pos.y) ||
        (food.x === pos.x && food.y === pos.y) ||
        obstacles.some((obstacle) =>
          obstacle.positions.some(
            (obstPos) => obstPos.x === pos.x && obstPos.y === pos.y
          )
        )
      );
    })
  );

  const positions = shape.map((offset) => ({
    x: baseX + offset.x,
    y: baseY + offset.y,
  }));

  return {
    id: Date.now() + Math.random(),
    positions,
    createdAt: Date.now(),
    duration: 5000 + Math.random() * 5000, // 5-10 seconds
  };
}

export function generateFood(
  snake: Position[],
  obstacles: Obstacle[],
  width: number,
  height: number
): Food {
  const gridWidth = Math.floor(width / GRID_SIZE);
  const gridHeight = Math.floor(height / GRID_SIZE);

  let newFoodPos: Position;
  do {
    newFoodPos = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
  } while (
    snake.some(
      (segment) => segment.x === newFoodPos.x && segment.y === newFoodPos.y
    ) ||
    obstacles.some((obstacle) =>
      obstacle.positions.some(
        (pos) => pos.x === newFoodPos.x && pos.y === newFoodPos.y
      )
    )
  );

  return {
    id: Date.now() + Math.random(),
    position: newFoodPos,
    createdAt: Date.now(),
    duration: 5000 + Math.random() * 5000, // 5-10 seconds
  };
}
