# 🐍 Advanced Snake Game

A modern, feature-rich Snake game built with Next.js, TypeScript, and Tailwind CSS. This isn't your typical Snake game - it includes dynamic obstacles, effect nodes, exploding shards, and a comprehensive debug system.

## 🎮 Game Features

### Core Gameplay
- **Classic Snake mechanics** with modern responsive controls
- **Dynamic food spawning** with expiration timers (5-10 seconds)
- **Wrapping borders** - snake wraps around screen edges
- **Progressive difficulty** - game speed increases as you progress
- **High score persistence** using localStorage

### Advanced Features
- **Dynamic Obstacles**: Random-shaped obstacles that spawn and disappear over time
- **Effect Nodes**: Special power-ups with different abilities
  - **Speed Boost (Blue)**: 2x speed multiplier for 5 seconds
  - **Exploding Node (Orange)**: Creates 8 shards that destroy obstacles
- **Shard System**: Animated projectiles that clear obstacles from the game field
- **Responsive Design**: Automatically adapts to different screen sizes

### Developer Features
- **Debug Mode**: Comprehensive real-time game state visualization
- **Modular Architecture**: Clean, extensible codebase with separated concerns
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance Optimized**: Efficient rendering and collision detection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd snake-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play!

### Build for Production

```bash
npm run build
npm run start
```

## 🎯 How to Play

### Controls
- **Arrow Keys**: Move the snake in four directions
- **Any Arrow Key**: Start the game
- **Debug Button**: Toggle debug mode on/off

### Gameplay Elements
- **🟤 Brown Food**: Eat to grow and score points (+10 points)
- **🔵 Blue Effect Nodes**: Consume for 2x speed boost (5 seconds)
- **🟠 Orange Exploding Nodes**: Creates shards that destroy obstacles
- **🔴 Red Obstacles**: Avoid these! They end the game on contact
- **🟠 Orange Shards**: Flying projectiles that clear obstacles

### Objectives
1. Eat food to grow your snake and increase your score
2. Use effect nodes strategically to manage obstacles
3. Survive as long as possible while avoiding obstacles and your own tail
4. Beat your high score!

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── components/          # React components
│   │   ├── SnakeGame.tsx   # Main game component
│   │   ├── GameOverlay.tsx # Start/game over screens
│   │   ├── ScoreDisplay.tsx # Score UI
│   │   ├── DebugPanel.tsx  # Debug information
│   │   └── GameInstructions.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameLogic.ts # Core game state management
│   │   └── useCanvasSize.ts # Responsive canvas sizing
│   ├── utils/              # Utility functions
│   │   ├── gameRenderer.ts # Canvas rendering logic
│   │   ├── gameUtils.ts    # Food/obstacle generation
│   │   └── effectUtils.ts  # Effect system utilities
│   ├── types/              # TypeScript definitions
│   │   └── game.ts         # Game state interfaces
│   └── page.tsx            # Main page component
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **HTML5 Canvas**: High-performance game rendering
- **React Hooks**: Modern state management

## 🐛 Debug Mode

Click the "🐛 Debug" button to access comprehensive game state information:

- **Game Speed**: Current update interval in milliseconds
- **Food Status**: Position, expiration timer, and metadata
- **Active Effects**: Current effects with remaining duration
- **Effect Nodes**: Available power-ups on the game field
- **Obstacles**: All obstacle positions and expiration times
- **Shards**: Active projectiles with position and velocity
- **Snake Info**: Length, head position, and current direction
- **Game State**: Score, high score, and game status

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint checks

### Adding New Effect Types

The effect system is designed for easy extensibility:

1. Add new effect type to `EffectType` enum in `types/game.ts`
2. Add configuration to `EFFECT_CONFIGS` 
3. Add color mapping in `getEffectColor()` function
4. Implement effect logic in `useGameLogic.ts`

Example:
```typescript
// 1. Add to enum
SLOW_TIME = 'SLOW_TIME',

// 2. Add config
[EffectType.SLOW_TIME]: {
  type: EffectType.SLOW_TIME,
  duration: 8000,
  value: 0.5,
  stackable: true,
},

// 3. Add color
case EffectType.SLOW_TIME:
  return `rgba(255, 255, 0, ${alpha})`; // Yellow
```

## 🎨 Features in Detail

### Effect System
- **Extensible Architecture**: Easy to add new effect types
- **Visual Feedback**: Distinct colors and animations for each effect
- **Time-based Effects**: Automatic expiration and cleanup
- **Stacking Logic**: Configurable stacking behavior per effect type

### Obstacle System  
- **Dynamic Shapes**: 9 different obstacle patterns (lines, L-shapes, T-shapes, squares, Z-shapes)
- **Smart Placement**: Avoids spawning on snake, food, or other obstacles
- **Progressive Difficulty**: Spawn rate increases with score
- **Visual Aging**: Obstacles fade as they approach expiration

### Shard System
- **Physics-based Movement**: Realistic projectile motion
- **Collision Detection**: Precise grid-based collision with obstacles
- **Visual Effects**: Fading orange particles with bright centers
- **Cleanup Logic**: Automatic removal when expired or out-of-bounds

## 📱 Responsive Design

The game automatically adapts to different screen sizes:
- **Mobile**: Optimized touch-friendly layout
- **Tablet**: Balanced canvas and UI sizing  
- **Desktop**: Full-featured experience with debug panel
- **Grid-based Scaling**: Maintains perfect pixel alignment

## 🚀 Performance Optimizations

- **Efficient Rendering**: Only redraws when game state changes
- **Optimized Collision Detection**: Grid-based algorithms for fast performance
- **Memory Management**: Automatic cleanup of expired game objects
- **Batch Operations**: Multiple simultaneous updates processed efficiently

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 🎯 Future Enhancements

Potential features for future development:
- **Multiplayer Support**: Real-time multiplayer snake battles
- **Power-up Variety**: More effect types (invincibility, score multipliers, etc.)
- **Level System**: Predefined levels with unique challenges
- **Sound Effects**: Audio feedback for actions and events
- **Particle Effects**: Enhanced visual effects for explosions and collisions
- **Mobile Controls**: Touch-based directional controls
- **Leaderboards**: Global high score tracking
- **Themes**: Multiple visual themes and color schemes