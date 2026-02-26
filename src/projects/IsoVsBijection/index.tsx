import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Check, X } from 'lucide-react';
import { ProjectLayout } from '@/components/layout/ProjectLayout';

// @ts-ignore
import docsZh from './docs_zh.md?raw';
// @ts-ignore
import docsEn from './docs.md?raw';

const IsoVsBijection: React.FC = () => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [showF, setShowF] = useState(true);
  const [showG, setShowG] = useState(false);

  // SVG Configuration
  const width = 600;
  const height = 400;
  const padding = 50;

  // Positions
  const setAX = 150;
  const setBX = 450;
  const nodeY1 = 100;
  const nodeY2 = 300;
  const radius = 25;

  // Check Logic (unchanged from before)
  const isFMonotone = true; // Vacuously true
  const isFBijective = true;
  const isGMonotone = false; // Fails order preservation

  // Helper: Drawing Logic for Arrows
  const renderArrow = (x1: number, y1: number, x2: number, y2: number, color: string, dashed: boolean = false, label?: string) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const trim = radius + 5;
    if (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) < trim * 2) return null;

    const startX = x1 + Math.cos(angle) * trim;
    const startY = y1 + Math.sin(angle) * trim;
    const endX = x2 - Math.cos(angle) * trim;
    const endY = y2 - Math.sin(angle) * trim;

    const midX = (startX + endX) / 2;
    const curveOffset = label === 'f' ? -30 : label === 'g' ? 30 : 0;
    const controlX = midX;
    const controlY = (startY + endY) / 2 + curveOffset;

    return (
      <g key={`${label}-${x1}-${y1}-${x2}-${y2}`}>
        <path
          d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeDasharray={dashed ? "5,5" : "none"}
          markerEnd={`url(#arrowhead-${color})`}
        />
        {label && (
          <text
            x={controlX}
            y={controlY + (label === 'f' ? -10 : 20)}
            textAnchor="middle"
            fill={color}
            fontSize="14"
            fontWeight="bold"
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  // --- Controls Panel Content ---
  const controls = (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <label className="flex items-center space-x-2 cursor-pointer bg-blue-50/50 p-2 rounded hover:bg-blue-50 transition-colors">
          <input
            type="checkbox"
            checked={showF}
            onChange={(e) => setShowF(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <span className="text-sm font-medium">Show f: A → B</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer bg-red-50/50 p-2 rounded hover:bg-red-50 transition-colors">
          <input
            type="checkbox"
            checked={showG}
            onChange={(e) => setShowG(e.target.checked)}
            className="h-4 w-4 text-red-600 rounded border-gray-300"
          />
          <span className="text-sm font-medium">Show g: B → A</span>
        </label>
      </div>

      <div className="space-y-4">
        <div className="border p-3 rounded-lg bg-blue-50/50">
          <h3 className="font-bold text-blue-800 text-sm flex items-center mb-2">
            Morphism <span className="italic mx-1">f</span> Analysis
          </h3>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              {isFBijective ? <Check className="w-3 h-3 text-green-600 mr-2" /> : <X className="w-3 h-3 text-red-600 mr-2" />}
              <span>{lang === 'zh' ? '双射 (Bijective)' : 'Bijective'}</span>
            </div>
            <div className="flex items-center text-xs">
              {isFMonotone ? <Check className="w-3 h-3 text-green-600 mr-2" /> : <X className="w-3 h-3 text-red-600 mr-2" />}
              <span>{lang === 'zh' ? '单调 (Monotone)' : 'Monotone'}</span>
            </div>
          </div>
        </div>

        {showG && (
          <div className={`border p-3 rounded-lg transition-all ${isGMonotone ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
            <h3 className={`font-bold text-sm flex items-center mb-2 ${isGMonotone ? 'text-green-800' : 'text-red-800'}`}>
              Inverse <span className="italic mx-1">g</span> Analysis
            </h3>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <Check className="w-3 h-3 text-green-600 mr-2" />
                <span>{lang === 'zh' ? '反向函数 (Function)' : 'Function'}</span>
              </div>
              <div className="flex items-start text-xs font-bold">
                {isGMonotone ? <Check className="w-3 h-3 text-green-600 mr-2 mt-0.5" /> : <X className="w-3 h-3 text-red-600 mr-2 mt-0.5" />}
                <span>{lang === 'zh' ? '保持结构 (Structure)?' : 'Preserves Structure?'}</span>
              </div>
            </div>
            {!isGMonotone && (
              <div className="mt-2 text-[10px] leading-tight text-red-700 bg-red-100/50 p-1.5 rounded">
                {lang === 'zh'
                  ? '违反: B中1≤2，但g(1)与g(2)在A中不可比'
                  : 'Violation: 1≤2 in B, but g(1), g(2) incomparable in A'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`p-3 rounded text-center border ${showG && !isGMonotone ? "bg-red-50 border-red-200 text-red-800" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
        <div className="text-xs uppercase tracking-wider font-semibold mb-1">
          {lang === 'zh' ? '结论' : 'Conclusion'}
        </div>
        <div className="font-bold text-sm">
          {showG && !isGMonotone
            ? (lang === 'zh' ? '❌ 非同构 (Not Isomorphic)' : '❌ Not Isomorphic')
            : (lang === 'zh' ? '✅ f 是双射态射' : '✅ f is Bijective Morphism')}
        </div>
      </div>
    </div>
  );

  // --- Visualization Panel Content ---
  const visualization = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold mb-6 text-gray-700">
        {lang === 'zh' ? 'Pos 范畴中的反例' : 'Counterexample in Pos Category'}
      </h2>
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full h-auto">
          <defs>
            <marker id="arrowhead-black" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
            </marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="red" />
            </marker>
          </defs>

          {/* Set A Visualization */}
          <text x={setAX} y={padding} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">Set A (Discrete)</text>
          <circle cx={setAX} cy={nodeY1} r={radius} fill="white" stroke="#333" strokeWidth="2" />
          <text x={setAX} y={nodeY1} dy="5" textAnchor="middle" fontSize="14">a</text>

          <circle cx={setAX} cy={nodeY2} r={radius} fill="white" stroke="#333" strokeWidth="2" />
          <text x={setAX} y={nodeY2} dy="5" textAnchor="middle" fontSize="14">b</text>

          {/* Set B Visualization */}
          <text x={setBX} y={padding} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">Set B (Ordered)</text>
          <circle cx={setBX} cy={nodeY1} r={radius} fill="white" stroke="#333" strokeWidth="2" />
          <text x={setBX} y={nodeY1} dy="5" textAnchor="middle" fontSize="14">1</text>

          <circle cx={setBX} cy={nodeY2} r={radius} fill="white" stroke="#333" strokeWidth="2" />
          <text x={setBX} y={nodeY2} dy="5" textAnchor="middle" fontSize="14">2</text>

          {/* Order in B: 1 <= 2 */}
          <path
            d={`M ${setBX} ${nodeY1 + radius + 5} L ${setBX} ${nodeY2 - radius - 5}`}
            stroke="#333"
            strokeWidth="2"
            markerEnd="url(#arrowhead-black)"
          />
          <text x={setBX + 15} y={(nodeY1 + nodeY2) / 2} fill="#333" fontSize="14" fontWeight="bold">≤</text>

          {/* Function f (Blue) */}
          {showF && (
            <>
              {renderArrow(setAX, nodeY1, setBX, nodeY1, '#2563eb', true, 'f')}
              {renderArrow(setAX, nodeY2, setBX, nodeY2, '#2563eb', true, 'f')}
            </>
          )}

          {/* Inverse g (Red) */}
          {showG && (
            <>
              {renderArrow(setBX, nodeY1, setAX, nodeY1, '#dc2626', true, 'g')}
              {renderArrow(setBX, nodeY2, setAX, nodeY2, '#dc2626', true, 'g')}
            </>
          )}
        </svg>
      </div>
      <p className="text-sm text-gray-500 mt-4 italic">
        {lang === 'zh'
          ? '* Set A 中元素没有箭头相连，表示没有序关系'
          : '* No arrows between elements in Set A implies no order relation'}
      </p>
    </div>
  );

  // --- Documentation Panel Content ---
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
      title={lang === 'zh' ? '范畴论同构 vs 集合双射' : 'Isomorphism vs Bijection'}
      lang={lang}
      setLang={setLang}
      controls={controls}
      visualization={visualization}
      documentation={documentation}
    />
  );
};

export default IsoVsBijection;
