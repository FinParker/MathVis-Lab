import { lazy, ComponentType } from 'react';

// 这里使用了 React.lazy 进行懒加载，确保首页加载速度
const RandomWalk = lazy(() => import('./RandomWalk/index'));
const RandomWalk1D = lazy(() => import('./RandomWalk1D/index'));
const FunctionMapping = lazy(() => import('./FunctionMapping/index'));
const RotationMatrix = lazy(() => import('./RotationMatrix/index'));
const Morphisms = lazy(() => import('./Morphisms/index'));
const IsoVsBijection = lazy(() => import('./IsoVsBijection/index'));
const SubgroupAutX = lazy(() => import('./SubgroupAutX/index'));
const CayleyYoneda = lazy(() => import('./CayleyYoneda/index'));

export interface MathProject {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  tags: string[];
  thumbnail?: string; // 暂时可选
  component: ComponentType;
}

const BASE_URL = import.meta.env.BASE_URL;

export const projectRegistry: MathProject[] = [
  {
    id: 'cayley-yoneda',
    title: '凯莱定理与米田引理 (Cayley & Yoneda)',
    title_en: "Cayley's Theorem & Yoneda Lemma",
    description: '从群的左平移作用到范畴论的米田嵌入：不仅要看它是什么，更要看它怎么影响别人。',
    description_en: 'From group actions (Left Regular Representation) to the Yoneda Embedding in Category Theory: not just what it is, but how it acts.',
    tags: ['Group Theory', 'Category Theory', 'Abstract Algebra'],
    component: CayleyYoneda,
  },
  {
    id: 'subgroup-aut-x',
    title: 'Aut(X) 子群与格结构 (Aut(X) Subgroups)',
    title_en: 'Aut(X) Subgroups (S3)',
    description: '深入探索对称群 S3 的子群结构，可视化拉格朗日定理与子群格 (Lattice)。',
    description_en: 'Explore the subgroup structure of the Symmetric Group S3, visualizing Lagrange Theorem and the Subgroup Lattice.',
    tags: ['Group Theory', 'Abstract Algebra', 'Combinatorics'],
    component: SubgroupAutX,
  },
  {
    id: 'iso-vs-bijection',
    title: '范畴论同构 vs 集合双射 (Isomorphism vs Bijection)',
    title_en: 'Isomorphism vs Bijection',
    description: '为什么双射不一定是同构？以偏序集（Poset）为例的交互式反例。',
    description_en: 'Why is a bijection not always an isomorphism? An interactive counterexample in Posets.',
    tags: ['Category Theory', 'Set Theory', 'Logic'],
    component: IsoVsBijection,
  },
  {
    id: 'category-morphisms',
    title: '范畴论态射 (Category Morphisms)',
    title_en: 'Category Theory: Morphisms',
    description: '从集合论函数推广到抽象箭头：单态射与满态射的可取消性质可视化。',
    description_en: 'Generalizing functions to abstract arrows: Visualizing cancellability of Monomorphisms and Epimorphisms.',
    tags: ['Category Theory', 'Abstract Algebra', 'Logic'],
    component: Morphisms,
  },
  {
    id: 'rotation-matrix',
    title: '旋转矩阵与群 SO(n) (Rotation Matrix)',
    title_en: 'Rotation Matrix & Group SO(n)',
    description: '通过极坐标推导 2D 旋转矩阵，并推广到 3D 欧拉角变换。',
    description_en: 'Visualizing linear transformations via matrices. From 2D rotation to 3D Euler angles.',
    tags: ['Linear Algebra', 'Geometry', 'Group Theory'],
    component: RotationMatrix,
  },
  {
    id: 'function-mapping',
    title: '集合映射与同态 (Set Mapping & Morphism)',
    title_en: 'Set Mapping & Morphism',
    description: '交互式演示全函数、单射、满射、双射以及同态、同构等抽象代数概念。',
    description_en: 'Interactive demonstration of functions, injection, surjection, bijection, homomorphism, and isomorphism.',
    tags: ['Set Theory', 'Algebra', 'discrete math'],
    component: FunctionMapping,
  },
  {
    id: 'random-walk',
    title: '二维随机游走 (2D Random Walk)',
    title_en: '2D Random Walk',
    description: '探索布朗运动的离散模型与中心极限定理演示。观察大量粒子如何随时间扩散。',
    description_en: 'Explore the discrete model of Brownian motion and Central Limit Theorem. Observe how particles diffuse over time.',
    tags: ['Probability', 'Diffusion', 'Stochastic Processes'],
    thumbnail: `${BASE_URL}thumbnails/rw-2d.svg`,
    component: RandomWalk,
  },
  {
    id: 'random-walk-1d',
    title: '一维随机游走 (1D Random Walk)',
    title_en: '1D Random Walk',
    description: '最简单的一维随机过程。观察粒子在直线上的随机运动与扩散行为。',
    description_en: 'The simplest 1D stochastic process. Observe particle random motion and diffusion behavior on a line.',
    tags: ['Probability', '1D', 'Diffusion'],
    thumbnail: `${BASE_URL}thumbnails/rw-1d.svg`,
    component: RandomWalk1D,
  },
  // 后续新项目直接在这里添加
];
