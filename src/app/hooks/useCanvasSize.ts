import { useState, useCallback, useEffect } from 'react';
import { GRID_SIZE } from '../types/game';

export function useCanvasSize() {
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  const updateCanvasSize = useCallback(() => {
    const maxWidth = Math.min(window.innerWidth - 40, 600);
    const maxHeight = Math.min(window.innerHeight - 200, 600);
    const size = Math.min(maxWidth, maxHeight);
    const gridCount = Math.floor(size / GRID_SIZE);
    const actualSize = gridCount * GRID_SIZE;
    setCanvasSize({ width: actualSize, height: actualSize });
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  return canvasSize;
}