import { useEffect, useRef } from 'react';
import { useMiningGame } from '@/lib/stores/useMiningGame';

const CELL_SIZE = 40;
const COLORS = {
  ' ': '#f5f5f5',
  '#': '#808080',
  'C': '#404040',
  'I': '#c0c0c0',
  'G': '#ffd700',
  'D': '#00bfff',
  'X': '#ff00ff',
  player: '#ff4444',
};

const ORE_NAMES = {
  'C': 'Coal',
  'I': 'Iron',
  'G': 'Gold',
  'D': 'Diamond',
  'X': 'Crystal',
};

export function MiningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mine, playerX, playerY, rows, cols } = useMiningGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = cols * CELL_SIZE;
    const height = rows * CELL_SIZE;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = mine[row]?.[col] || ' ';
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        ctx.fillStyle = COLORS[cell] || COLORS[' '];
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        if (cell !== ' ' && cell !== '#') {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
      }
    }

    const playerPixelX = playerX * CELL_SIZE;
    const playerPixelY = playerY * CELL_SIZE;

    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(
      playerPixelX + CELL_SIZE / 2,
      playerPixelY + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('*', playerPixelX + CELL_SIZE / 2, playerPixelY + CELL_SIZE / 2);

  }, [mine, playerX, playerY, rows, cols]);

  const scrollToPlayer = () => {
    if (canvasRef.current) {
      const containerHeight = window.innerHeight * 0.6;
      const playerPixelY = playerY * CELL_SIZE;
      const scrollTop = playerPixelY - containerHeight / 2 + CELL_SIZE / 2;
      
      const container = canvasRef.current.parentElement;
      if (container) {
        container.scrollTop = Math.max(0, scrollTop);
      }
    }
  };

  useEffect(() => {
    scrollToPlayer();
  }, [playerY]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border-4 border-gray-800 rounded-lg shadow-2xl"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
