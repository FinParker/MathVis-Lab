import { useState, useCallback, useRef, useEffect } from 'react';

export type StatPoint1D = { step: number; msd: number; theoretical: number };

export function useRandomWalk1DSimulation(params: { maxSteps: number; sampleSize: number; speed: number }) {
  // paths: number[][] -> paths[i] 是第 i 条路径的所有位置数组
  const [paths, setPaths] = useState<number[][]>([]);
  const [stats, setStats] = useState<StatPoint1D[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const requestRef = useRef<number>();

  const initialize = useCallback(() => {
    // 初始位置全是 0
    const newPaths: number[][] = Array(params.sampleSize).fill(null).map(() => [0]);
    setPaths(newPaths);
    setStats([{ step: 0, msd: 0, theoretical: 0 }]);
    setCurrentStep(0);
  }, [params.sampleSize]);

  const step = useCallback(() => {
    setPaths(prevPaths => {
      if (prevPaths[0].length > params.maxSteps) {
        setIsPlaying(false);
        return prevPaths;
      }

      const newPaths = prevPaths.map(path => {
        const last = path[path.length - 1];
        // 1D: +1 or -1 with p=0.5
        const move = Math.random() < 0.5 ? 1 : -1;
        return [...path, last + move];
      });

      // 计算 MSD = E[x^2]
      let sqSum = 0;
      newPaths.forEach(p => {
        const cur = p[p.length - 1];
        sqSum += cur * cur;
      });
      const msd = sqSum / params.sampleSize;
      const currentStepCount = newPaths[0].length - 1;

      setStats(prev => [...prev, { step: currentStepCount, msd, theoretical: currentStepCount }]);
      setCurrentStep(prev => prev + 1);

      return newPaths;
    });
  }, [params.maxSteps, params.sampleSize]);

  const animate = useCallback(() => {
    if (isPlaying) {
      step();
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
      step
    }
  };
}
