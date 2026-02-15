import { useRef, useEffect } from 'react';

interface RWCanvas1DProps {
  paths: number[][];
  maxSteps: number;
}

export default function RWCanvas1D({ paths, maxSteps }: RWCanvas1DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // 清空
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    // 坐标系映射
    // X轴: 时间 (steps), 范围 [0, maxSteps]
    // Y轴: 位置 (position), 范围 [-3*sqrt(N), +3*sqrt(N)] 大约估计
    const rangeY = Math.sqrt(maxSteps) * 4;
    const scaleX = width / maxSteps;
    const scaleY = height / (rangeY * 2);
    const centerY = height / 2;

    // 绘制坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    // T轴 (中间水平线)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 绘制路径
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;

    paths.forEach((path, i) => {
      if (path.length < 1) return;

      ctx.strokeStyle = `hsl(${(i * 137.5) % 360}, 70%, 60%)`;
      ctx.beginPath();
      ctx.moveTo(0, centerY - path[0] * scaleY);

      for (let t = 1; t < path.length; t++) {
        ctx.lineTo(t * scaleX, centerY - path[t] * scaleY);
      }
      ctx.stroke();
    });

  }, [paths, maxSteps]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
