import { useCallback, useState, useEffect } from "react";
import {
  GameState,
  Position,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  GRID_SIZE,
  Obstacle,
  BASE_GAME_SPEED,
  EffectType,
} from "../types/game";
import {
  generateEffectNode,
  applyEffect,
  updateActiveEffects,
  calculateGameSpeed,
  shouldSpawnEffectNode,
  generateShards,
  updateShards,
  checkShardObstacleCollision,
  getRandomEffectType,
} from "../utils/effectUtils";
import { AIPlayer } from "../utils/aiPlayer";
import { generateObstacle, generateFood } from "../utils/gameUtils";

export function useGameLogic(canvasSize: { width: number; height: number }) {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: null,
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
    highScore: 0,
    obstacles: [],
    effectNodes: [],
    activeEffects: [],
    gameSpeed: BASE_GAME_SPEED,
    shards: [],
    aiMode: false,
  });
  const [lastEffectSpawnTime, setLastEffectSpawnTime] = useState(Date.now());
  const [debugMode, setDebugMode] = useState(false);
  const [aiPlayer] = useState(() => new AIPlayer(canvasSize.width, canvasSize.height));

  const toggleDebugMode = useCallback(() => {
    setDebugMode((prev) => !prev);
  }, []);

  const toggleAIMode = useCallback(() => {
    setGameState((prev) => ({ ...prev, aiMode: !prev.aiMode }));
  }, []);
  const [gameStarted, setGameStarted] = useState(false);

  const getHighScore = useCallback(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("snakeHighScore") || "0");
    }
    return 0;
  }, []);

  const saveHighScore = useCallback((score: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("snakeHighScore", score.toString());
    }
  }, []);

  useEffect(() => {
    setGameState((prev) => ({ ...prev, highScore: getHighScore() }));
  }, [getHighScore]);

  // Initialize food when component mounts
  useEffect(() => {
    if (!gameState.food) {
      const initialFood = generateFood(
        INITIAL_SNAKE,
        [],
        canvasSize.width,
        canvasSize.height
      );
      setGameState((prev) => ({ ...prev, food: initialFood }));
    }
  }, [canvasSize, gameState.food]);

  // Update AI player when canvas size changes
  useEffect(() => {
    aiPlayer.updateGridSize(canvasSize.width, canvasSize.height);
  }, [canvasSize, aiPlayer]);

  // AI move calculation
  useEffect(() => {
    if (gameState.aiMode && gameStarted && !gameState.gameOver) {
      const aiMove = aiPlayer.calculateNextMove(gameState);
      
      setGameState((prev) => {
        // Only update direction if it's different and valid
        if (aiMove.x !== prev.direction.x || aiMove.y !== prev.direction.y) {
          return { ...prev, direction: aiMove };
        }
        return prev;
      });
    }
  }, [gameState, gameStarted, aiPlayer]);

  const resetGame = useCallback(() => {
    const newFood = generateFood(
      INITIAL_SNAKE,
      [],
      canvasSize.width,
      canvasSize.height
    );
    setGameState((prev) => ({
      snake: INITIAL_SNAKE,
      food: newFood,
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      highScore: getHighScore(),
      obstacles: [],
      effectNodes: [],
      activeEffects: [],
      gameSpeed: BASE_GAME_SPEED,
      shards: [],
      aiMode: prev.aiMode, // Preserve AI mode setting
    }));
    setLastEffectSpawnTime(Date.now());
    setGameStarted(false);
  }, [canvasSize, getHighScore]);

  const endgameCheck = (
    newHead: Position,
    snake: Position[],
    obstacles: Obstacle[]
  ) => {
    // Check collision with tail
    if (
      snake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )
    ) {
      return true;
    }

    // Check collision with obstacles
    if (
      obstacles.some((obstacle) =>
        obstacle.positions.some(
          (pos) => pos.x === newHead.x && pos.y === newHead.y
        )
      )
    ) {
      return true;
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || !gameStarted) return prevState;

      const {
        snake,
        direction,
        food,
        score,
        highScore,
        obstacles,
        effectNodes,
        activeEffects,
        shards,
      } = prevState;

      if (direction.x === 0 && direction.y === 0) return prevState;

      const head = snake[0];
      const gridWidth = Math.floor(canvasSize.width / GRID_SIZE);
      const gridHeight = Math.floor(canvasSize.height / GRID_SIZE);

      let newX = (head.x + direction.x) % gridWidth;
      if (newX === -1) {
        newX = gridWidth - 1;
      }

      let newY = (head.y + direction.y) % gridHeight;
      if (newY === -1) {
        newY = gridHeight - 1;
      }

      const newHead: Position = {
        x: newX,
        y: newY,
      };

      // Check collision with snake body
      if (endgameCheck(newHead, snake, obstacles)) {
        const finalScore = score > highScore ? score : highScore;
        if (score > highScore) {
          saveHighScore(score);
        }
        return { ...prevState, gameOver: true, highScore: finalScore };
      }

      const newSnake = [newHead, ...snake];
      let newFood = food;
      let newScore = score;
      let newEffectNodes = [...effectNodes];
      let newActiveEffects = [...activeEffects];
      let newShards = [...shards];

      // Check if current food has expired
      const currentTime = Date.now();
      if (food && currentTime - food.createdAt > food.duration) {
        newFood = null;
      }

      // Check if snake ate the food
      if (
        food &&
        newHead.x === food.position.x &&
        newHead.y === food.position.y
      ) {
        newScore += 10;
        newFood = generateFood(
          newSnake,
          obstacles,
          canvasSize.width,
          canvasSize.height
        );
      } else {
        newSnake.pop();
      }

      // Check if snake ate an effect node
      const consumedEffectIndex = effectNodes.findIndex(
        (node) => node.position.x === newHead.x && node.position.y === newHead.y
      );

      if (consumedEffectIndex !== -1) {
        const consumedEffect = effectNodes[consumedEffectIndex];

        if (consumedEffect.effectType === EffectType.EXPLODING_NODE) {
          // Generate shards from the exploding node
          const newShardsFromExplosion = generateShards(
            consumedEffect.position
          );
          newShards = [...newShards, ...newShardsFromExplosion];
        } else {
          // Apply normal effect
          newActiveEffects = applyEffect(
            consumedEffect.effectType,
            newActiveEffects
          );
        }

        newEffectNodes = effectNodes.filter(
          (_, index) => index !== consumedEffectIndex
        );
      }

      // Generate new food if none exists
      if (!newFood) {
        newFood = generateFood(
          newSnake,
          obstacles,
          canvasSize.width,
          canvasSize.height
        );
      }

      // Update active effects (remove expired ones)
      newActiveEffects = updateActiveEffects(newActiveEffects);

      // Update shards (move and remove expired/out-of-bounds ones)
      newShards = updateShards(newShards, gridWidth, gridHeight);

      // Clean up expired effect nodes
      newEffectNodes = newEffectNodes.filter(
        (node) => currentTime - node.createdAt < node.duration
      );

      // Clean up expired obstacles
      const activeObstacles = obstacles.filter(
        (obstacle) => currentTime - obstacle.createdAt < obstacle.duration
      );

      // Spawn new obstacle occasionally
      let newObstacles = [...activeObstacles];
      const timeSinceLastObstacle =
        activeObstacles.length > 0
          ? currentTime - Math.max(...activeObstacles.map((o) => o.createdAt))
          : currentTime;

      const spawnInterval = Math.max(3000, 7000 - score * 50);

      if (timeSinceLastObstacle > spawnInterval && Math.random() < 0.3) {
        try {
          const newObstacle = generateObstacle(
            newSnake,
            newFood?.position || { x: -1, y: -1 },
            activeObstacles,
            gridWidth,
            gridHeight
          );
          newObstacles.push(newObstacle);
        } catch (error) {
          console.log("Failed generating obstacle", error);
        }
      }

      // Spawn new effect node occasionally
      if (
        shouldSpawnEffectNode(newScore, newEffectNodes, lastEffectSpawnTime)
      ) {
        try {
          const randomEffectType = getRandomEffectType();
          const newEffectNode = generateEffectNode(
            newSnake,
            newFood,
            activeObstacles,
            newEffectNodes,
            gridWidth,
            gridHeight,
            randomEffectType
          );
          newEffectNodes.push(newEffectNode);
          setLastEffectSpawnTime(currentTime);
        } catch (error) {
          console.log("Failed generating effect node", error);
        }
      }

      // Check if any shards hit obstacles
      const shardObstacleCollision = checkShardObstacleCollision(
        newShards,
        activeObstacles
      );
      if (shardObstacleCollision.hitShards.length > 0) {
        // Remove hit shards
        newShards = newShards.filter(
          (shard) => !shardObstacleCollision.hitShards.includes(shard.id)
        );

        // Remove hit obstacles
        newObstacles = activeObstacles.filter(
          (_, index) => !shardObstacleCollision.hitObstacles.includes(index)
        );
      }

      // Calculate new game speed based on active effects
      const newGameSpeed = calculateGameSpeed(
        BASE_GAME_SPEED,
        newActiveEffects
      );

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
        obstacles: newObstacles,
        effectNodes: newEffectNodes,
        activeEffects: newActiveEffects,
        gameSpeed: newGameSpeed,
        shards: newShards,
      };
    });
  }, [gameStarted, canvasSize, saveHighScore, lastEffectSpawnTime]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default behavior for game control keys
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }

      if (!gameStarted) {
        if (
          e.code === "Space" ||
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
        ) {
          setGameStarted(true);
        }
      }

      setGameState((prevState) => {
        const { direction } = prevState;
        let newDirection = direction;

        switch (e.code) {
          case "ArrowUp":
            if (direction.y === 0) newDirection = { x: 0, y: -1 };
            break;
          case "ArrowDown":
            if (direction.y === 0) newDirection = { x: 0, y: 1 };
            break;
          case "ArrowLeft":
            if (direction.x === 0) newDirection = { x: -1, y: 0 };
            break;
          case "ArrowRight":
            if (direction.x === 0) newDirection = { x: 1, y: 0 };
            break;
          case "Space":
            if (prevState.gameOver) {
              return prevState;
            }
            break;
        }

        return { ...prevState, direction: newDirection };
      });
    },
    [gameStarted]
  );

  return {
    gameState,
    gameStarted,
    debugMode,
    resetGame,
    moveSnake,
    handleKeyPress,
    toggleDebugMode,
    toggleAIMode,
    aiPlayer,
  };
}
