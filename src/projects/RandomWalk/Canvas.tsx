import { useRef, useEffect } from 'react';
import { Point } from './Simulation';

interface RWCanvasProps {
  paths: Point[][];
  viewSize?: number; // 视野范围，比如 [-50, 50] -> 100
}

export default function RWCanvas({ paths, viewSize = 100 }: RWCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取 DPR 优化清晰度
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // 清空画布
    ctx.clearRect(0, 0, rect.width, rect.height);

    // 绘制背景 (黑色)
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 坐标变换：中心为 (0,0)
    // viewSize 代表画布宽度对应的逻辑长度
    // scale = pixel_width / logic_width
    const scale = rect.width / viewSize;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 绘制坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(rect.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, rect.height);
    ctx.stroke();

    // 绘制路径
    // 为了性能，当路径很多时，应该只画一部分或者降低透明度
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;

    paths.forEach((path, i) => {
      if (path.length < 1) return;

      // 随机颜色或根据索引着色
      // 简单起见，用青色
      ctx.strokeStyle = `hsl(${(i * 137.5) % 360}, 70%, 60%)`;
      ctx.beginPath();

      // 起点
      ctx.moveTo(cx + path[0].x * scale, cy - path[0].y * scale); // 注意 Canvas Y轴向下，数学Y轴向上

      for (let j = 1; j < path.length; j++) {
        ctx.lineTo(cx + path[j].x * scale, cy - path[j].y * scale);
      }
      ctx.stroke();

      // 绘制当前头部的点
      const last = path[path.length - 1];
      ctx.fillStyle = 'white';
      ctx.beginPath();
      // 固定点大小 2px
      ctx.arc(cx + last.x * scale, cy - last.y * scale, 2, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [paths, viewSize]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}
