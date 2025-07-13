interface GameInstructionsProps {
  aiMode?: boolean;
}

export default function GameInstructions({
  aiMode = false,
}: GameInstructionsProps) {
  return (
    <div className="text-sm text-gray-400 font-mono text-center max-w-md">
      {aiMode ? (
        <>
          <div className="text-blue-400 mb-2">🤖 AI Player Active</div>
          <div>AI uses A* pathfinding to navigate</div>
          <div>
            Prioritizes food {">"} exploding nodes {">"} speed boosts
          </div>
          <div>Avoids obstacles and its own tail</div>
          <div>Makes real-time tactical decisions</div>
        </>
      ) : (
        <>
          <div>Arrow keys: Move snake</div>
          <div>Eat brown food to grow and score points</div>
          <div>Blue nodes: Speed boost effect</div>
          <div>Orange nodes: Create exploding shards</div>
          <div>Shards destroy obstacles they hit</div>
          <div>Avoid red obstacles and your own tail</div>
        </>
      )}
    </div>
  );
}
