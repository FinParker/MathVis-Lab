import { lazy, ComponentType } from 'react';

// 这里使用了 React.lazy 进行懒加载，确保首页加载速度
const RandomWalk = lazy(() => import('./RandomWalk/index'));
const RandomWalk1D = lazy(() => import('./RandomWalk1D/index'));

export interface MathProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail?: string; // 暂时可选
  component: ComponentType;
}

export const projectRegistry: MathProject[] = [
  {
    id: 'random-walk',
    title: '二维随机游走 (2D Random Walk)',
    description: '探索布朗运动的离散模型与中心极限定理演示。观察大量粒子如何随时间扩散。',
    tags: ['Probability', 'Diffusion', 'Stochastic Processes'],
    component: RandomWalk,
  },
  {
    id: 'random-walk-1d',
    title: '一维随机游走 (1D Random Walk)',
    description: '最简单的一维随机过程。观察粒子在直线上的随机运动与扩散行为。',
    tags: ['Probability', '1D', 'Diffusion'],
    component: RandomWalk1D,
  },
  // 后续新项目直接在这里添加
];
