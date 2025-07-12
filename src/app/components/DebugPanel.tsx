import { GameState } from '../types/game';

interface DebugPanelProps {
  gameState: GameState;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  return `${(diff / 1000).toFixed(1)}s ago`;
}

function formatDuration(duration: number): string {
  return `${(duration / 1000).toFixed(1)}s`;
}

function formatPosition(pos: { x: number; y: number }): string {
  return `(${pos.x}, ${pos.y})`;
}

export default function DebugPanel({ gameState }: DebugPanelProps) {
  const currentTime = Date.now();

  return (
    <div className="bg-black bg-opacity-80 text-green-400 p-4 rounded border border-green-500 font-mono text-xs max-w-md">
      <h3 className="text-green-300 font-bold mb-3 text-sm">🐛 DEBUG MODE</h3>
      
      {/* Game Speed */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">Game Speed:</div>
        <div className="ml-2">{gameState.gameSpeed}ms interval</div>
      </div>

      {/* Food Information */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">Food:</div>
        {gameState.food ? (
          <div className="ml-2">
            <div>Position: {formatPosition(gameState.food.position)}</div>
            <div>ID: {gameState.food.id}</div>
            <div>Created: {formatTime(gameState.food.createdAt)}</div>
            <div>Duration: {formatDuration(gameState.food.duration)}</div>
            <div>
              Expires in: {formatDuration(
                Math.max(0, gameState.food.duration - (currentTime - gameState.food.createdAt))
              )}
            </div>
          </div>
        ) : (
          <div className="ml-2 text-red-400">No food available</div>
        )}
      </div>

      {/* Active Effects */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">
          Active Effects ({gameState.activeEffects.length}):
        </div>
        {gameState.activeEffects.length > 0 ? (
          <div className="ml-2">
            {gameState.activeEffects.map((effect) => (
              <div key={effect.id} className="mb-1 border-l-2 border-blue-500 pl-2">
                <div className="text-blue-300">{effect.type}</div>
                <div>Value: {effect.value}x</div>
                <div>Started: {formatTime(effect.startTime)}</div>
                <div>
                  Expires in: {formatDuration(
                    Math.max(0, effect.duration - (currentTime - effect.startTime))
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-2 text-gray-400">No active effects</div>
        )}
      </div>

      {/* Effect Nodes */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">
          Effect Nodes ({gameState.effectNodes.length}):
        </div>
        {gameState.effectNodes.length > 0 ? (
          <div className="ml-2">
            {gameState.effectNodes.map((node) => (
              <div key={node.id} className="mb-1 border-l-2 border-blue-500 pl-2">
                <div className="text-blue-300">{node.effectType}</div>
                <div>Position: {formatPosition(node.position)}</div>
                <div>Created: {formatTime(node.createdAt)}</div>
                <div>
                  Expires in: {formatDuration(
                    Math.max(0, node.duration - (currentTime - node.createdAt))
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-2 text-gray-400">No effect nodes</div>
        )}
      </div>

      {/* Obstacles */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">
          Obstacles ({gameState.obstacles.length}):
        </div>
        {gameState.obstacles.length > 0 ? (
          <div className="ml-2">
            {gameState.obstacles.map((obstacle, index) => (
              <div key={obstacle.id} className="mb-1 border-l-2 border-red-500 pl-2">
                <div className="text-red-300">Obstacle #{index + 1}</div>
                <div>Positions: {obstacle.positions.length} blocks</div>
                <div>Created: {formatTime(obstacle.createdAt)}</div>
                <div>
                  Expires in: {formatDuration(
                    Math.max(0, obstacle.duration - (currentTime - obstacle.createdAt))
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  Blocks: {obstacle.positions.map(pos => formatPosition(pos)).join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-2 text-gray-400">No obstacles</div>
        )}
      </div>

      {/* Shards */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">
          Shards ({gameState.shards.length}):
        </div>
        {gameState.shards.length > 0 ? (
          <div className="ml-2">
            {gameState.shards.map((shard, index) => (
              <div key={shard.id} className="mb-1 border-l-2 border-orange-500 pl-2">
                <div className="text-orange-300">Shard #{index + 1}</div>
                <div>Position: {formatPosition(shard.position)}</div>
                <div>Velocity: {formatPosition(shard.velocity)}</div>
                <div>Created: {formatTime(shard.createdAt)}</div>
                <div>
                  Expires in: {formatDuration(
                    Math.max(0, shard.duration - (currentTime - shard.createdAt))
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-2 text-gray-400">No shards</div>
        )}
      </div>

      {/* Snake Information */}
      <div className="mb-3">
        <div className="text-green-300 font-semibold">Snake:</div>
        <div className="ml-2">
          <div>Length: {gameState.snake.length} segments</div>
          <div>Head: {formatPosition(gameState.snake[0])}</div>
          <div>Direction: {formatPosition(gameState.direction)}</div>
        </div>
      </div>

      {/* Game State */}
      <div>
        <div className="text-green-300 font-semibold">Game State:</div>
        <div className="ml-2">
          <div>Score: {gameState.score}</div>
          <div>High Score: {gameState.highScore}</div>
          <div>Game Over: {gameState.gameOver ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
}