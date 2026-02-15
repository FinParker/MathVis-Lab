import { useState, useCallback, useRef, useEffect } from 'react';

export type Point = { x: number; y: number };
export type StatPoint = { step: number; msd: number; theoretical: number };

export function useRandomWalkSimulation(params: { maxSteps: number; sampleSize: number; speed: number }) {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [stats, setStats] = useState<StatPoint[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const requestRef = useRef<number>();

  // 初始化
  const initialize = useCallback(() => {
    const newPaths: Point[][] = Array(params.sampleSize).fill(null).map(() => [{ x: 0, y: 0 }]);
    setPaths(newPaths);
    setStats([{ step: 0, msd: 0, theoretical: 0 }]);
    setCurrentStep(0);
  }, [params.sampleSize]);

  // 单步模拟逻辑
  const step = useCallback(() => {
    setPaths(prevPaths => {
      // 如果当前步数已达上限，停止
      if (prevPaths[0].length > params.maxSteps) {
        setIsPlaying(false);
        return prevPaths;
      }

      const newPaths = prevPaths.map(path => {
        const last = path[path.length - 1];
        // 简单的随机游走：上下左右
        const r = Math.random();
        let dx = 0, dy = 0;
        if (r < 0.25) dx = 1;
        else if (r < 0.5) dx = -1;
        else if (r < 0.75) dy = 1;
        else dy = -1;

        return [...path, { x: last.x + dx, y: last.y + dy }];
      });

      // 计算 MSD
      // MSD = sum(x^2 + y^2) / N
      let sqSum = 0;
      newPaths.forEach(p => {
        const cur = p[p.length - 1];
        sqSum += cur.x * cur.x + cur.y * cur.y;
      });
      const msd = sqSum / params.sampleSize;
      const currentStepCount = newPaths[0].length - 1;

      setStats(prev => [...prev, { step: currentStepCount, msd, theoretical: currentStepCount }]);
      setCurrentStep(prev => prev + 1);

      return newPaths;
    });
  }, [params.maxSteps, params.sampleSize]);

  // 动画循环
  const animate = useCallback(() => {
    if (isPlaying) {
      step();
      // 简单的速度控制：利用 setTimeout 模拟 FPS，实际应该用 timestamp
      // 这里为了简单演示，先用 requestAnimationFrame 把控全速或限速
      // 这是一个改进点：更精确的时间控制
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, step]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  // 参数改变时重置
  useEffect(() => {
    initialize();
    setIsPlaying(false);
  }, [initialize]);

  return {
    paths,
    stats,
    currentStep,
    isPlaying,
    actions: {
      start: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      reset: initialize,
      step // 单步调试用
    }
  };
}
