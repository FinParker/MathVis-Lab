import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ProjectLayout } from '@/components/layout/ProjectLayout';

// @ts-ignore
import docsZh from './docs_zh.md?raw';
// @ts-ignore
import docsEn from './docs.md?raw';

// --- Math Logic ---

type Permutation = [number, number, number];

interface GroupElement {
  id: string;
  latex: string;
  perm: Permutation;
  type: 'identity' | 'transposition' | 'cycle';
  color: string;
}

const ELEMENTS: GroupElement[] = [
  { id: 'e', latex: 'e', perm: [0, 1, 2], type: 'identity', color: 'bg-gray-100 border-gray-300' },
  { id: '(12)', latex: '(12)', perm: [1, 0, 2], type: 'transposition', color: 'bg-red-50 border-red-200' },
  { id: '(23)', latex: '(23)', perm: [0, 2, 1], type: 'transposition', color: 'bg-red-50 border-red-200' },
  { id: '(13)', latex: '(13)', perm: [2, 1, 0], type: 'transposition', color: 'bg-red-50 border-red-200' },
  { id: '(123)', latex: '(123)', perm: [1, 2, 0], type: 'cycle', color: 'bg-blue-50 border-blue-200' },
  { id: '(132)', latex: '(132)', perm: [2, 0, 1], type: 'cycle', color: 'bg-blue-50 border-blue-200' },
];

const SUBGROUPS = [
  { name: 'E', elements: ['e'] },
  { name: 'H₁ (12)', elements: ['e', '(12)'] },
  { name: 'H₂ (23)', elements: ['e', '(23)'] },
  { name: 'H₃ (13)', elements: ['e', '(13)'] },
  { name: 'H₄ (A₃)', elements: ['e', '(123)', '(132)'] },
  { name: 'S₃ (Full)', elements: ['e', '(12)', '(23)', '(13)', '(123)', '(132)'] },
];

// Helper: Compose permutations (f o g)(x) = f(g(x))
// Applying g first (right), then f (left)
const compose = (f: Permutation, g: Permutation): Permutation => {
  return [
    f[g[0]],
    f[g[1]],
    f[g[2]]
  ];
};

const getElementByPerm = (p: Permutation): GroupElement => {
  return ELEMENTS.find(e => e.perm[0] === p[0] && e.perm[1] === p[1] && e.perm[2] === p[2]) || ELEMENTS[0];
};

const SubgroupAutX: React.FC = () => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [selectedSubgroupIndex, setSelectedSubgroupIndex] = useState<number>(5); // Default Full Group
  const [compositionElements, setCompositionElements] = useState<[GroupElement, GroupElement] | null>(null);

  const currentSubgroup = SUBGROUPS[selectedSubgroupIndex];

  const handleCompose = (a: GroupElement, b: GroupElement) => {
    setCompositionElements([a, b]);
  };

  const compositionResult = useMemo(() => {
    if (!compositionElements) return null;
    const [a, b] = compositionElements;
    const resultPerm = compose(a.perm, b.perm);
    return getElementByPerm(resultPerm);
  }, [compositionElements]);

  // --- Controls ---
  const controls = (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">
          {lang === 'zh' ? '选择子群 (Select Subgroup)' : 'Select Subgroup'}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {SUBGROUPS.map((sg, idx) => (
            <button
              key={sg.name}
              onClick={() => {
                setSelectedSubgroupIndex(idx);
                setCompositionElements(null);
              }}
              className={`px-3 py-2 text-left text-sm rounded transition-colors border ${selectedSubgroupIndex === idx
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
            >
              <span className="font-bold">{sg.name}</span>
              <span className="text-xs ml-2 opacity-80">
                Order: {sg.elements.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {lang === 'zh' ? '乘法演示 (Multiplication)' : 'Multiplication Demo'}
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          {lang === 'zh'
            ? '点击两个元素进行复合操作 A ∘ B'
            : 'Click two elements to compose A ∘ B'}
        </p>
        {/* Multiplication Table Mini-view or just status */}
        {compositionElements ? (
          <div className="p-3 bg-gray-50 rounded border text-center">
            <div className="flex items-center justify-center gap-2 text-lg font-bold mb-2">
              <span>{compositionElements[0].latex}</span>
              <span className="text-gray-400">∘</span>
              <span>{compositionElements[1].latex}</span>
              <span>=</span>
              <span className="text-primary">{compositionResult?.latex}</span>
            </div>
            <div className="text-xs text-gray-500">
              ({lang === 'zh' ? '先执行右边, 再执行左边' : 'Apply Right first, then Left'})
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded border text-center text-sm text-gray-400 italic">
            {lang === 'zh' ? '未选择操作' : 'No operation selected'}
          </div>
        )}
      </div>
    </div>
  );

  // --- Visualization ---
  // Helper to draw the lattice
  const LatticeNode = ({ sgIndex, x, y }: { sgIndex: number, x: number, y: number }) => {
    const sg = SUBGROUPS[sgIndex];
    const isSelected = selectedSubgroupIndex === sgIndex;
    // Check if current selected subgroup contains this subgroup
    const currentElements = SUBGROUPS[selectedSubgroupIndex].elements;
    const isSubset = sg.elements.every(e => currentElements.includes(e));

    return (
      <g
        onClick={() => setSelectedSubgroupIndex(sgIndex)}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <circle
          cx={x} cy={y} r="18"
          fill={isSelected ? '#3b82f6' : isSubset ? '#bfdbfe' : '#ffffff'}
          stroke={isSelected ? '#1d4ed8' : '#cbd5e1'}
          strokeWidth={isSelected ? 3 : 2}
        />
        <text x={x} y={y} dy="5" textAnchor="middle" fontSize="12" fill={isSelected ? 'white' : 'black'} fontWeight="bold">
          {sg.elements.length}
        </text>
        <text x={x} y={y + 35} textAnchor="middle" fontSize="10" fill="#64748b">
          {sg.name.split(' ')[0]}
        </text>
      </g>
    );
  };

  const LatticeLink = ({ start, end }: { start: [number, number], end: [number, number] }) => (
    <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#e2e8f0" strokeWidth="2" />
  );

  // Lattice coordinates
  const latticeCoords: Record<number, [number, number]> = {
    5: [150, 40],  // S3 (Top)
    4: [80, 120],  // H4 (Order 3)
    1: [150, 120], // H1 (Order 2)
    2: [220, 120], // H2 (Order 2)
    3: [290, 120], // H3 (Order 2) - visual offset adjusted
    0: [150, 200], // E (Bottom)
  };

  const visualization = (
    <div className="h-full w-full flex flex-col p-4 bg-white rounded-lg shadow-sm border overflow-y-auto">

      {/* Top Section: Active Elements */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          {lang === 'zh' ? '当前子群元素' : 'Active Subgroup Elements'}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({currentSubgroup.elements.length} elements)
          </span>
        </h3>
        <div className="flex flex-wrap gap-4">
          {ELEMENTS.map((el) => {
            const isActive = currentSubgroup.elements.includes(el.id);
            return (
              <button
                key={el.id}
                disabled={!isActive}
                onClick={() => {
                  if (compositionElements && compositionElements[0]) {
                    handleCompose(compositionElements[0], el);
                  } else {
                    setCompositionElements([el, el]); // Start composition with self as placeholder or wait for second click? 
                    // Let's implement simpler logic: Click 1 sets A, Click 2 sets B
                    // But here we just set A=el, B=waiting... logic might be complex for simple view
                    // Let's just set [el, ?] state if we want complex interaction
                    // For now, let's just make clicking an element set it as "Right" operand if "Left" is set?
                    // Actually simplest: Clear composition on subgroup change.
                    // If composition is null, set [el, el] (square).
                    // If composition is filled, set [el, old_right] -> shift?
                    // Let's go with: Click A -> Set A as Left. Then Click B -> Set B as Right.
                    if (!compositionElements) {
                      // Start new composition
                      setCompositionElements([el, el]);
                    } else {
                      // Shift: New element becomes Right operand, Old Right becomes Left? 
                      // Or just replace Right operand?
                      // Let's replace Right operand.
                      setCompositionElements([compositionElements[0], el]);
                    }
                  }
                }}
                className={`w-24 h-28 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${isActive
                  ? `${el.color} shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1`
                  : 'bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed grayscale'
                  }`}
              >
                <div className="text-xl font-bold mb-2">{el.latex}</div>

                {/* Permutation Visual mini */}
                <div className="flex gap-1 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">1</span>
                    <span className="font-bold">↓</span>
                    <span>{el.perm[0] + 1}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">2</span>
                    <span className="font-bold">↓</span>
                    <span>{el.perm[1] + 1}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">3</span>
                    <span className="font-bold">↓</span>
                    <span>{el.perm[2] + 1}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Structure Visuals */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">

        {/* Left: Lattice Diagram */}
        <div className="border rounded bg-gray-50/50 p-4 relative flex items-center justify-center">
          <div className="absolute top-2 left-2 text-xs font-bold text-gray-500 uppercase">
            {lang === 'zh' ? '子群格 (Hasse Diagram)' : 'Subgroup Lattice'}
          </div>
          <svg width="320" height="240" viewBox="0 0 320 240">
            {/* Links */}
            <LatticeLink start={latticeCoords[0]} end={latticeCoords[4]} />
            <LatticeLink start={latticeCoords[0]} end={latticeCoords[1]} />
            <LatticeLink start={latticeCoords[0]} end={latticeCoords[2]} />
            <LatticeLink start={latticeCoords[0]} end={latticeCoords[3]} />

            <LatticeLink start={latticeCoords[4]} end={latticeCoords[5]} />
            <LatticeLink start={latticeCoords[1]} end={latticeCoords[5]} />
            <LatticeLink start={latticeCoords[2]} end={latticeCoords[5]} />
            <LatticeLink start={latticeCoords[3]} end={latticeCoords[5]} />

            {/* Nodes */}
            {/* S3 */}
            <LatticeNode sgIndex={5} x={latticeCoords[5][0]} y={latticeCoords[5][1]} />

            {/* H4 - A3 */}
            <LatticeNode sgIndex={4} x={latticeCoords[4][0]} y={latticeCoords[4][1]} />

            {/* H1, H2, H3 */}
            <LatticeNode sgIndex={1} x={latticeCoords[1][0]} y={latticeCoords[1][1]} />
            <LatticeNode sgIndex={2} x={latticeCoords[2][0]} y={latticeCoords[2][1]} />
            <LatticeNode sgIndex={3} x={latticeCoords[3][0]} y={latticeCoords[3][1]} />

            {/* E */}
            <LatticeNode sgIndex={0} x={latticeCoords[0][0]} y={latticeCoords[0][1]} />
          </svg>
        </div>

        {/* Right: Permutation Action Visual */}
        <div className="border rounded bg-white p-4 relative flex flex-col items-center justify-center">
          <div className="absolute top-2 left-2 text-xs font-bold text-gray-500 uppercase">
            {lang === 'zh' ? '作用效果 (Action on {1,2,3})' : 'Action Visual'}
          </div>

          {compositionResult ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-3 gap-8">
                {[0, 1, 2].map((idx) => {
                  const source = idx + 1;
                  const target = compositionResult.perm[idx] + 1;
                  const isStay = source === target;
                  return (
                    <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 rounded shadow-sm border">
                      <div className="text-xl font-bold text-gray-400 mb-2">{source}</div>
                      <div className={`text-2xl font-bold ${isStay ? 'text-gray-300' : 'text-blue-500'}`}>
                        ↓
                      </div>
                      <div className="text-xl font-bold mt-2">{target}</div>
                    </div>
                  )
                })}
              </div>
              <div className="absolute top-4 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                Applying: <span className="font-bold">{compositionResult.latex}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 italic text-sm">
              {lang === 'zh' ? '在上方选择元素查看映射' : 'Select element above to see mapping'}
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // --- Documentation ---
  const documentation = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {lang === 'zh' ? docsZh : docsEn}
    </ReactMarkdown>
  );

  return (
    <ProjectLayout
      title={lang === 'zh' ? 'Aut(X) 子群与格结构' : 'Aut(X) Subgroups (S3)'}
      lang={lang}
      setLang={setLang}
      controls={controls}
      visualization={visualization}
      documentation={documentation}
    />
  );
}

export default SubgroupAutX;
