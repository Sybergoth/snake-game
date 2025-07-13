import { Position, GameState, EffectType, GRID_SIZE } from "../types/game";

export interface AITarget {
  position: Position;
  priority: number;
  type: "food" | "effect" | "avoid";
}

export interface PathNode {
  position: Position;
  g: number; // Cost from start
  h: number; // Heuristic cost to goal
  f: number; // Total cost
  parent: PathNode | null;
}

export class AIPlayer {
  private gridWidth: number;
  private gridHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.gridWidth = Math.floor(canvasWidth / GRID_SIZE);
    this.gridHeight = Math.floor(canvasHeight / GRID_SIZE);
  }

  updateGridSize(canvasWidth: number, canvasHeight: number): void {
    this.gridWidth = Math.floor(canvasWidth / GRID_SIZE);
    this.gridHeight = Math.floor(canvasHeight / GRID_SIZE);
  }

  // Calculate Manhattan distance
  private manhattanDistance(a: Position, b: Position): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Check if position is safe (not occupied by snake body, obstacles, or out of bounds)
  private isSafePosition(pos: Position, gameState: GameState): boolean {
    // Check bounds (with wrapping)
    const normalizedPos = {
      x: ((pos.x % this.gridWidth) + this.gridWidth) % this.gridWidth,
      y: ((pos.y % this.gridHeight) + this.gridHeight) % this.gridHeight,
    };

    // Check snake body collision (excluding head as it will move)
    const snakeBody = gameState.snake.slice(1);
    if (
      snakeBody.some(
        (segment) =>
          segment.x === normalizedPos.x && segment.y === normalizedPos.y
      )
    ) {
      return false;
    }

    // Check obstacle collision
    if (
      gameState.obstacles.some((obstacle) =>
        obstacle.positions.some(
          (obstPos) =>
            obstPos.x === normalizedPos.x && obstPos.y === normalizedPos.y
        )
      )
    ) {
      return false;
    }

    return true;
  }

  // Get all possible moves from current position
  private getPossibleMoves(
    position: Position,
    currentDirection: Position,
    gameState: GameState
  ): Position[] {
    const moves: Position[] = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
    ];

    return moves.filter((move) => {
      // Don't reverse direction (180-degree turn)
      if (currentDirection.x !== 0 && move.x === -currentDirection.x)
        return false;
      if (currentDirection.y !== 0 && move.y === -currentDirection.y)
        return false;

      // Check if the resulting position is safe
      const newPos = {
        x: position.x + move.x,
        y: position.y + move.y,
      };

      return this.isSafePosition(newPos, gameState);
    });
  }

  // A* pathfinding algorithm
  private findPath(
    start: Position,
    goal: Position,
    gameState: GameState
  ): Position[] {
    const openSet: PathNode[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: PathNode = {
      position: start,
      g: 0,
      h: this.manhattanDistance(start, goal),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;

    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find node with lowest f cost
      openSet.sort((a, b) => a.f - b.f);
      const currentNode = openSet.shift()!;

      const posKey = `${currentNode.position.x},${currentNode.position.y}`;
      if (closedSet.has(posKey)) continue;
      closedSet.add(posKey);

      // Check if we reached the goal
      if (
        currentNode.position.x === goal.x &&
        currentNode.position.y === goal.y
      ) {
        // Reconstruct path
        const path: Position[] = [];
        let node: PathNode | null = currentNode;
        while (node?.parent) {
          path.unshift(node.position);
          node = node.parent;
        }
        return path;
      }

      // Check neighbors
      const moves = this.getPossibleMoves(
        currentNode.position,
        { x: 0, y: 0 },
        gameState
      );

      for (const move of moves) {
        const neighborPos = {
          x: currentNode.position.x + move.x,
          y: currentNode.position.y + move.y,
        };

        // Normalize position for wrapping
        neighborPos.x =
          ((neighborPos.x % this.gridWidth) + this.gridWidth) % this.gridWidth;
        neighborPos.y =
          ((neighborPos.y % this.gridHeight) + this.gridHeight) %
          this.gridHeight;

        const neighborKey = `${neighborPos.x},${neighborPos.y}`;
        if (closedSet.has(neighborKey)) continue;

        const g = currentNode.g + 1;
        const h = this.manhattanDistance(neighborPos, goal);
        const f = g + h;

        const existingNode = openSet.find(
          (node) =>
            node.position.x === neighborPos.x &&
            node.position.y === neighborPos.y
        );

        if (!existingNode || g < existingNode.g) {
          const neighborNode: PathNode = {
            position: neighborPos,
            g,
            h,
            f,
            parent: currentNode,
          };

          if (existingNode) {
            // Update existing node
            const index = openSet.indexOf(existingNode);
            openSet[index] = neighborNode;
          } else {
            openSet.push(neighborNode);
          }
        }
      }
    }

    return []; // No path found
  }

  // Evaluate targets and choose the best one
  private evaluateTargets(gameState: GameState): AITarget | null {
    const targets: AITarget[] = [];
    const head = gameState.snake[0];

    // Add food as target
    if (gameState.food) {
      const distance = this.manhattanDistance(head, gameState.food.position);
      const timeRemaining =
        gameState.food.duration - (Date.now() - gameState.food.createdAt);
      const urgency = Math.max(0, 1 - timeRemaining / gameState.food.duration);

      targets.push({
        position: gameState.food.position,
        priority: 100 - distance + urgency * 50, // Higher priority for closer food and urgent food
        type: "food",
      });
    }

    // Add effect nodes as targets
    gameState.effectNodes.forEach((node) => {
      const distance = this.manhattanDistance(head, node.position);
      let basePriority = 60; // Lower than food

      // Prioritize exploding nodes when there are many obstacles
      if (
        node.effectType === EffectType.EXPLODING_NODE &&
        gameState.obstacles.length > 2
      ) {
        basePriority = 80;
      }

      // Prioritize speed boosts when score is high (game is harder)
      if (node.effectType === EffectType.SPEED_BOOST && gameState.score > 50) {
        basePriority = 70;
      }

      targets.push({
        position: node.position,
        priority: basePriority - distance,
        type: "effect",
      });
    });

    // Return highest priority target
    targets.sort((a, b) => b.priority - a.priority);
    return targets.length > 0 ? targets[0] : null;
  }

  // Calculate the best move for the AI
  calculateNextMove(gameState: GameState): Position {
    const head = gameState.snake[0];
    const currentDirection = gameState.direction;

    // Find the best target
    const target = this.evaluateTargets(gameState);

    if (target) {
      // Try to find path to target
      const path = this.findPath(head, target.position, gameState);

      if (path.length > 0) {
        const nextPos = path[0];
        const move = {
          x: nextPos.x - head.x,
          y: nextPos.y - head.y,
        };

        // Handle wrapping
        if (Math.abs(move.x) > 1) {
          move.x = move.x > 0 ? -1 : 1;
        }
        if (Math.abs(move.y) > 1) {
          move.y = move.y > 0 ? -1 : 1;
        }

        // Validate the move
        if (
          this.isSafePosition(
            { x: head.x + move.x, y: head.y + move.y },
            gameState
          )
        ) {
          return move;
        }
      }
    }

    // Fallback: find any safe move
    const possibleMoves = this.getPossibleMoves(
      head,
      currentDirection,
      gameState
    );

    if (possibleMoves.length > 0) {
      // Prefer continuing in the same direction if safe
      const continueStraight = possibleMoves.find(
        (move) => move.x === currentDirection.x && move.y === currentDirection.y
      );

      if (continueStraight) {
        return continueStraight;
      }

      // Otherwise, pick the first safe move
      return possibleMoves[0];
    }

    // If no safe moves, continue current direction (will likely result in game over)
    return currentDirection;
  }

  // Get AI decision explanation for debug purposes
  getDecisionExplanation(gameState: GameState): string {
    const target = this.evaluateTargets(gameState);
    const head = gameState.snake[0];
    const possibleMoves = this.getPossibleMoves(
      head,
      gameState.direction,
      gameState
    );

    if (!target) {
      return `No targets found. ${possibleMoves.length} safe moves available.`;
    }

    const distance = this.manhattanDistance(head, target.position);
    const path = this.findPath(head, target.position, gameState);

    return `Target: ${target.type} at (${target.position.x},${
      target.position.y
    }), Distance: ${distance}, Priority: ${target.priority.toFixed(
      1
    )}, Path length: ${path.length}`;
  }
}
