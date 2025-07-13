interface GameOverlayProps {
  type: 'start' | 'gameOver';
  score?: number;
  highScore?: number;
  onRestart?: () => void;
  aiMode?: boolean;
}

export default function GameOverlay({ type, score, highScore, onRestart, aiMode = false }: GameOverlayProps) {
  if (type === 'start') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-green-500 text-center">
        <div className="font-mono">
          <div className="text-2xl mb-2">SNAKE GAME</div>
          {aiMode ? (
            <>
              <div className="text-blue-400 mb-2">🤖 AI MODE ACTIVE</div>
              <div>AI will play automatically</div>
              <div>Press any arrow key to start</div>
            </>
          ) : (
            <>
              <div>Use arrow keys to move</div>
              <div>Press any arrow key to start</div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-red-500 text-center">
      <div className="font-mono">
        <div className="text-2xl mb-2">GAME OVER</div>
        <div>Final Score: {score}</div>
        <div>High Score: {highScore}</div>
        <button
          onClick={onRestart}
          className="mt-4 px-4 py-2 bg-green-600 text-white border border-green-500 hover:bg-green-700 font-mono"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}