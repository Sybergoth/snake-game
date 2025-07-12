export default function GameInstructions() {
  return (
    <div className="text-sm text-gray-400 font-mono text-center max-w-md">
      <div>Arrow keys: Move snake</div>
      <div>Eat brown food to grow and score points</div>
      <div>Blue nodes: Speed boost effect</div>
      <div>Orange nodes: Create exploding shards</div>
      <div>Shards destroy obstacles they hit</div>
      <div>Avoid red obstacles and your own tail</div>
    </div>
  );
}