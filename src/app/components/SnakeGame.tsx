"use client";

import { useEffect, useRef } from "react";
import { useCanvasSize } from "../hooks/useCanvasSize";
import { useGameLogic } from "../hooks/useGameLogic";
import { renderGame } from "../utils/gameRenderer";
import GameOverlay from "./GameOverlay";
import ScoreDisplay from "./ScoreDisplay";
import GameInstructions from "./GameInstructions";
import DebugPanel from "./DebugPanel";

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useCanvasSize();
  const {
    gameState,
    gameStarted,
    debugMode,
    resetGame,
    moveSnake,
    handleKeyPress,
    toggleDebugMode,
    toggleAIMode,
    aiPlayer,
  } = useGameLogic(canvasSize);

  // Set up keyboard event listeners (only when not in AI mode)
  useEffect(() => {
    if (!gameState.aiMode) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, gameState.aiMode]);

  // Set up game loop with dynamic speed
  useEffect(() => {
    const gameLoop = setInterval(moveSnake, gameState.gameSpeed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameState.gameSpeed]);

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderGame(canvas, gameState);
  }, [gameState, canvasSize]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <ScoreDisplay score={gameState.score} highScore={gameState.highScore} />
        <button
          onClick={toggleDebugMode}
          className="px-3 py-1 bg-gray-700 text-green-400 border border-green-500 hover:bg-gray-600 font-mono text-sm rounded"
        >
          {debugMode ? "🐛 Debug ON" : "🐛 Debug"}
        </button>
        <button
          onClick={toggleAIMode}
          className="px-3 py-1 bg-gray-700 text-blue-400 border border-blue-500 hover:bg-gray-600 font-mono text-sm rounded"
        >
          {gameState.aiMode ? "🤖 AI ON" : "🤖 AI"}
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-2 border-green-500 bg-black"
        />

        {!gameStarted && !gameState.gameOver && (
          <GameOverlay type="start" aiMode={gameState.aiMode} />
        )}

        {gameState.gameOver && (
          <GameOverlay
            type="gameOver"
            score={gameState.score}
            highScore={gameState.highScore}
            onRestart={resetGame}
            aiMode={gameState.aiMode}
          />
        )}
      </div>

      <div className="flex gap-4 items-start">
        <GameInstructions aiMode={gameState.aiMode} />
        {debugMode && <DebugPanel gameState={gameState} aiPlayer={aiPlayer} />}
      </div>
    </div>
  );
}
