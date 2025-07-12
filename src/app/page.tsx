import SnakeGame from './components/SnakeGame';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-green-500 font-mono mb-2">
          SNAKE GAME
        </h1>
        <p className="text-green-400 font-mono text-lg">
          Classic retro arcade action
        </p>
      </div>
      
      <SnakeGame />
      
      <div className="mt-8 text-center text-green-600 font-mono text-sm max-w-md">
        <p>A nostalgic recreation of the classic Snake game.</p>
        <p>Grow your snake, avoid collisions, and beat your high score!</p>
      </div>
    </div>
  );
}
