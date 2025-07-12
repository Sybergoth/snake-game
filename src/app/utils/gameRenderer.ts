import { Food, GameState, GRID_SIZE, EffectNode, Shard } from "../types/game";
import { getEffectColor } from "./effectUtils";

export function renderGame(
  canvas: HTMLCanvasElement,
  gameState: GameState
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  renderSnake(ctx, gameState.snake);

  // Draw food
  if (gameState.food) {
    renderFood(ctx, gameState.food);
  }

  // Draw obstacles
  renderObstacles(ctx, gameState.obstacles);
  
  // Draw effect nodes
  renderEffectNodes(ctx, gameState.effectNodes);
  
  // Draw shards
  renderShards(ctx, gameState.shards);
}

function renderSnake(
  ctx: CanvasRenderingContext2D,
  snake: { x: number; y: number }[]
): void {
  ctx.fillStyle = "#0f0";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * GRID_SIZE,
      segment.y * GRID_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    );
  });
}

function renderFood(ctx: CanvasRenderingContext2D, food: Food): void {
  const currentTime = Date.now();

  const age = currentTime - food.createdAt;
  const lifeRatio = age / food.duration;

  const alpha = Math.max(0.3, 1 - lifeRatio * 0.7);

  const red = Math.floor(139 * alpha);
  const green = Math.floor(69 * alpha);
  const blue = Math.floor(19 * alpha);
  ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

  ctx.fillRect(
    food.position.x * GRID_SIZE,
    food.position.y * GRID_SIZE,
    GRID_SIZE - 1,
    GRID_SIZE - 1
  );
}

function renderObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: GameState["obstacles"]
): void {
  const currentTime = Date.now();

  obstacles.forEach((obstacle) => {
    const age = currentTime - obstacle.createdAt;
    const lifeRatio = age / obstacle.duration;

    // Fade out as obstacle gets older
    const alpha = Math.max(0.3, 1 - lifeRatio * 0.7);

    // Color shifts from bright red to dark red as it ages
    const red = Math.floor(255 * alpha);
    const green = 0;
    const blue = Math.floor(100 * alpha);

    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

    obstacle.positions.forEach((pos) => {
      ctx.fillRect(
        pos.x * GRID_SIZE,
        pos.y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
      );
    });
  });
}

function renderShards(
  ctx: CanvasRenderingContext2D,
  shards: Shard[]
): void {
  const currentTime = Date.now();

  shards.forEach((shard) => {
    const age = currentTime - shard.createdAt;
    const lifeRatio = age / shard.duration;

    // Fade out as shard gets older
    const alpha = Math.max(0.2, 1 - lifeRatio * 0.8);

    // Orange color with fading
    ctx.fillStyle = `rgba(255, 140, 0, ${alpha})`;

    // Calculate pixel position
    const pixelX = shard.position.x * GRID_SIZE;
    const pixelY = shard.position.y * GRID_SIZE;
    const size = shard.size * GRID_SIZE;

    // Draw shard as a small square
    ctx.fillRect(
      pixelX,
      pixelY,
      size,
      size
    );

    // Add a bright center for better visibility
    ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.8})`;
    ctx.fillRect(
      pixelX + size * 0.25,
      pixelY + size * 0.25,
      size * 0.5,
      size * 0.5
    );
  });
}

function renderEffectNodes(
  ctx: CanvasRenderingContext2D,
  effectNodes: EffectNode[]
): void {
  const currentTime = Date.now();

  effectNodes.forEach((effectNode) => {
    const age = currentTime - effectNode.createdAt;
    const lifeRatio = age / effectNode.duration;

    // Create pulsing effect
    const pulseIntensity = Math.sin(currentTime * 0.008) * 0.3 + 0.7;
    
    // Fade out as effect node gets older
    const alpha = Math.max(0.4, (1 - lifeRatio * 0.6) * pulseIntensity);

    ctx.fillStyle = getEffectColor(effectNode.effectType, alpha);

    // Draw the effect node with slight glow effect
    ctx.fillRect(
      effectNode.position.x * GRID_SIZE,
      effectNode.position.y * GRID_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    );
    
    // Add inner highlight for better visibility
    ctx.fillStyle = getEffectColor(effectNode.effectType, alpha * 0.5);
    ctx.fillRect(
      effectNode.position.x * GRID_SIZE + 2,
      effectNode.position.y * GRID_SIZE + 2,
      GRID_SIZE - 5,
      GRID_SIZE - 5
    );
  });
}
