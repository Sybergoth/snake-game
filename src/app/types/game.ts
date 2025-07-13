export interface Position {
  x: number;
  y: number;
}

export interface Obstacle {
  id: number;
  positions: Position[];
  createdAt: number;
  duration: number;
}

export interface Food {
  id: number;
  position: Position;
  createdAt: number;
  duration: number;
}

export enum EffectType {
  SPEED_BOOST = "SPEED_BOOST",
  EXPLODING_NODE = "EXPLODING_NODE",
  // Future effects can be added here:
  // SLOW_TIME = 'SLOW_TIME',
  // INVINCIBILITY = 'INVINCIBILITY',
  // SCORE_MULTIPLIER = 'SCORE_MULTIPLIER',
}

export interface EffectConfig {
  type: EffectType;
  duration: number;
  value: number;
  stackable: boolean;
}

export interface ActiveEffect {
  id: string;
  type: EffectType;
  startTime: number;
  duration: number;
  value: number;
}

export interface EffectNode {
  id: string;
  position: Position;
  effectType: EffectType;
  createdAt: number;
  duration: number;
  config: EffectConfig;
}

export interface Shard {
  id: string;
  position: Position;
  velocity: Position;
  createdAt: number;
  duration: number;
  size: number;
}

export interface GameState {
  snake: Position[];
  food: Food | null;
  direction: Position;
  gameOver: boolean;
  score: number;
  highScore: number;
  obstacles: Obstacle[];
  effectNodes: EffectNode[];
  activeEffects: ActiveEffect[];
  gameSpeed: number;
  shards: Shard[];
  aiMode: boolean;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
export const INITIAL_DIRECTION: Position = { x: 0, y: 0 };
export const BASE_GAME_SPEED = 75;

// Effect configurations
export const EFFECT_CONFIGS: Record<EffectType, EffectConfig> = {
  [EffectType.SPEED_BOOST]: {
    type: EffectType.SPEED_BOOST,
    duration: 5000, // 5 seconds
    value: 2, // 2x speed multiplier
    stackable: false,
  },
  [EffectType.EXPLODING_NODE]: {
    type: EffectType.EXPLODING_NODE,
    duration: 0, // Instant effect
    value: 12, // Number of shards
    stackable: false,
  },
};
