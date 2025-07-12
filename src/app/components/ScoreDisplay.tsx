interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

export default function ScoreDisplay({ score, highScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-8 text-xl font-mono">
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  );
}