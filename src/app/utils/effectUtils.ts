import {
  Position,
  Obstacle,
  Food,
  EffectNode,
  EffectType,
  ActiveEffect,
  Shard,
  GRID_SIZE,
  EFFECT_CONFIGS,
} from "../types/game";

export function generateEffectNode(
  snake: Position[],
  food: Food | null,
  obstacles: Obstacle[],
  existingEffectNodes: EffectNode[],
  gridWidth: number,
  gridHeight: number,
  effectType: EffectType = EffectType.SPEED_BOOST
): EffectNode {
  let position: Position;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
    attempts++;
  } while (
    attempts < maxAttempts &&
    // Check distance from snake head (at least 3 units away)
    (Math.abs(position.x - snake[0].x) + Math.abs(position.y - snake[0].y) <
      3 ||
      // Check if overlaps with snake, food, obstacles, or other effect nodes
      snake.some(
        (segment) => segment.x === position.x && segment.y === position.y
      ) ||
      (food &&
        food.position.x === position.x &&
        food.position.y === position.y) ||
      obstacles.some((obstacle) =>
        obstacle.positions.some(
          (pos) => pos.x === position.x && pos.y === position.y
        )
      ) ||
      existingEffectNodes.some(
        (node) =>
          node.position.x === position.x && node.position.y === position.y
      ))
  );

  const config = EFFECT_CONFIGS[effectType];

  return {
    id: `effect-${Date.now()}-${Math.random()}`,
    position,
    effectType,
    createdAt: Date.now(),
    duration: 8000 + Math.random() * 7000, // 8-15 seconds visibility
    config,
  };
}

export function applyEffect(
  effectType: EffectType,
  activeEffects: ActiveEffect[]
): ActiveEffect[] {
  const config = EFFECT_CONFIGS[effectType];
  const newEffect: ActiveEffect = {
    id: `active-${Date.now()}-${Math.random()}`,
    type: effectType,
    startTime: Date.now(),
    duration: config.duration,
    value: config.value,
  };

  if (config.stackable) {
    return [...activeEffects, newEffect];
  } else {
    // Remove existing effects of the same type if not stackable
    const filteredEffects = activeEffects.filter(
      (effect) => effect.type !== effectType
    );
    return [...filteredEffects, newEffect];
  }
}

export function updateActiveEffects(
  activeEffects: ActiveEffect[]
): ActiveEffect[] {
  const currentTime = Date.now();
  return activeEffects.filter(
    (effect) => currentTime - effect.startTime < effect.duration
  );
}

export function calculateGameSpeed(
  baseSpeed: number,
  activeEffects: ActiveEffect[]
): number {
  let speedMultiplier = 1;

  activeEffects.forEach((effect) => {
    switch (effect.type) {
      case EffectType.SPEED_BOOST:
        speedMultiplier *= effect.value;
        break;
      // Future effects can be handled here
    }
  });

  return baseSpeed / speedMultiplier; // Minimum speed limit
}

export function getEffectColor(
  effectType: EffectType,
  alpha: number = 1
): string {
  switch (effectType) {
    case EffectType.SPEED_BOOST:
      return `rgba(0, 100, 255, ${alpha})`; // Blue
    case EffectType.EXPLODING_NODE:
      return `rgba(255, 140, 0, ${alpha})`; // Orange
    // Future effect colors can be added here:
    // case EffectType.SLOW_TIME:
    //   return `rgba(255, 255, 0, ${alpha})`; // Yellow
    // case EffectType.INVINCIBILITY:
    //   return `rgba(255, 0, 255, ${alpha})`; // Magenta
    default:
      return `rgba(0, 100, 255, ${alpha})`;
  }
}

export function generateShards(
  centerPosition: Position,
  gridWidth: number,
  gridHeight: number
): Shard[] {
  const shards: Shard[] = [];
  const directions = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 },  { x: 0, y: 0 },  { x: 1, y: 0 },
    { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
  ];

  directions.forEach((dir, index) => {
    // Skip center (0,0) direction
    if (dir.x === 0 && dir.y === 0) return;

    const velocity = {
      x: dir.x * 0.5, // Slower movement for better visibility
      y: dir.y * 0.5
    };

    shards.push({
      id: `shard-${Date.now()}-${index}`,
      position: { ...centerPosition },
      velocity,
      createdAt: Date.now(),
      duration: 3000, // 3 seconds
      size: 0.4 // Smaller than grid cells
    });
  });

  return shards;
}

export function updateShards(
  shards: Shard[],
  gridWidth: number,
  gridHeight: number
): Shard[] {
  const currentTime = Date.now();
  
  return shards
    .filter(shard => currentTime - shard.createdAt < shard.duration)
    .map(shard => {
      const newPosition = {
        x: shard.position.x + shard.velocity.x,
        y: shard.position.y + shard.velocity.y
      };

      // Remove shards that have moved off the grid
      if (newPosition.x < -1 || newPosition.x > gridWidth || 
          newPosition.y < -1 || newPosition.y > gridHeight) {
        return null;
      }

      return {
        ...shard,
        position: newPosition
      };
    })
    .filter(Boolean) as Shard[];
}

export function checkShardObstacleCollision(
  shards: Shard[],
  obstacles: Obstacle[]
): { hitShards: string[], hitObstacles: number[] } {
  const hitShards: string[] = [];
  const hitObstacles: number[] = [];

  shards.forEach(shard => {
    const shardGridX = Math.floor(shard.position.x);
    const shardGridY = Math.floor(shard.position.y);
    
    obstacles.forEach((obstacle, obstacleIndex) => {
      const hit = obstacle.positions.some(pos => 
        pos.x === shardGridX && pos.y === shardGridY
      );
      
      if (hit && !hitShards.includes(shard.id) && !hitObstacles.includes(obstacleIndex)) {
        hitShards.push(shard.id);
        hitObstacles.push(obstacleIndex);
      }
    });
  });

  return { hitShards, hitObstacles };
}

export function shouldSpawnEffectNode(
  score: number,
  existingEffectNodes: EffectNode[],
  lastEffectSpawnTime: number
): boolean {
  const currentTime = Date.now();
  const timeSinceLastEffect = currentTime - lastEffectSpawnTime;

  // Spawn rate increases with score, but has a minimum interval
  const baseInterval = 15000; // 15 seconds base
  const scoreReduction = Math.min(score * 100, 10000); // Max 10 second reduction
  const spawnInterval = Math.max(5000, baseInterval - scoreReduction); // Min 5 seconds

  // Limit to 2 effect nodes on screen at once
  const maxEffectNodes = 2;

  return (
    existingEffectNodes.length < maxEffectNodes &&
    timeSinceLastEffect > spawnInterval &&
    Math.random() < 0.4 // 40% chance when conditions are met
  );
}

export function getRandomEffectType(): EffectType {
  const effectTypes = Object.values(EffectType);
  return effectTypes[Math.floor(Math.random() * effectTypes.length)];
}
