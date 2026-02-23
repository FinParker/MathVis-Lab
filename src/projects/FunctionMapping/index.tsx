import { useState, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import docsEn from './docs.md?raw';
import docsZh from './docs_zh.md?raw';

// --- Types ---

interface SetElement {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Mapping {
  fromId: string;
  toId: string;
}

// For Homomorphism
interface StructureRelation {
  fromId: string;
  toId: string;
}

type Mode = 'mapping' | 'homomorphism';

// --- Default Data ---

const SET_A_DEFAULT: SetElement[] = [
  { id: 'a1', label: 'a₁', x: 50, y: 50 },
  { id: 'a2', label: 'a₂', x: 50, y: 150 },
  { id: 'a3', label: 'a₃', x: 50, y: 250 },
];

const SET_B_DEFAULT: SetElement[] = [
  { id: 'b1', label: 'b₁', x: 350, y: 50 },
  { id: 'b2', label: 'b₂', x: 350, y: 150 },
  { id: 'b3', label: 'b₃', x: 350, y: 250 },
  { id: 'b4', label: 'b₄', x: 350, y: 350 },
];

// Relation on A (e.g., a1 -> a2 -> a3)
const RELATION_A: StructureRelation[] = [
  { fromId: 'a1', toId: 'a2' },
  { fromId: 'a2', toId: 'a3' },
];

// Relation on B (e.g., b1 -> b2 -> b3 -> b4)
const RELATION_B: StructureRelation[] = [
  { fromId: 'b1', toId: 'b2' },
  { fromId: 'b2', toId: 'b3' },
  { fromId: 'b3', toId: 'b4' },
];

const DEFAULT_MAPPINGS: Mapping[] = [
  { fromId: 'a1', toId: 'b1' },
  { fromId: 'a2', toId: 'b2' },
  { fromId: 'a3', toId: 'b3' },
];

const TRANSLATIONS = {
  en: {
    mode: "Mode",
    mappingMode: "Mapping Properties",
    morphismMode: "Structure Morphisms",
    actions: "Actions",
    clearSelected: "Clear Selected",
    clearAll: "Clear All",
    reset: "Reset",
    analysis: "Analysis",
    functionTotal: "Function (Total)",
    notFunction: "Not a Function",
    partialFunction: "Partial Function",
    injective: "Injective (1-to-1)",
    surjective: "Surjective (Onto)",
    bijective: "Bijective",
    homomorphism: "Homomorphism",
    isomorphism: "Isomorphism",
    structureNote: "Structure: Graph structure. A Homomorphism $f: A \\to B$ preserves adjacency.",
    setA: "Set A",
    setB: "Set B",
    selectHint: "Selected {label}. Click an element in Set B to map.",
    clickHint: "Click an element in Set A to start mapping.",
    lang: "Language / 语言",
    github: "GitHub"
  },
  zh: {
    mode: "模式",
    mappingMode: "集合映射",
    morphismMode: "结构同态",
    actions: "操作",
    clearSelected: "清除选中",
    clearAll: "清除全部",
    reset: "重置",
    analysis: "性质分析",
    functionTotal: "函数 (全)",
    notFunction: "非函数 (一对多)",
    partialFunction: "偏函数 (非全)",
    injective: "单射 (一对一)",
    surjective: "满射 (映上)",
    bijective: "双射 (一一对应)",
    homomorphism: "同态",
    isomorphism: "同构",
    structureNote: "结构说明: 图结构。同态 $f: A \\to B$ 保持邻接关系: 若 A 中 $u \\to v$, 则 B 中 $f(u) \\to f(v)$。",
    setA: "集合 A",
    setB: "集合 B",
    selectHint: "已选中 {label}。点击集合 B 中的元素建立映射。",
    clickHint: "点击集合 A 中的元素开始映射。",
    lang: "语言 / Language",
    github: "GitHub"
  }
};

export default function FunctionMappingProject() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [mode, setMode] = useState<Mode>('mapping');

  const t = TRANSLATIONS[lang];

  // State for Sets
  const [setA, setSetA] = useState<SetElement[]>(SET_A_DEFAULT);
  const [setB, setSetB] = useState<SetElement[]>(SET_B_DEFAULT);

  // State for Mapping (Function f: A -> B)
  const [mappings, setMappings] = useState<Mapping[]>(DEFAULT_MAPPINGS);

  // Selection for adding mapping
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // --- Logic ---

  const handleElementClick = (element: SetElement, isSetA: boolean) => {
    if (isSetA) {
      if (selectedSource === element.id) {
        setSelectedSource(null);
      } else {
        setSelectedSource(element.id);
      }
    } else {
      // If clicked set B element and we have a selected source from A
      if (selectedSource) {
        // Toggle mapping: if exists remove, else add. 
        // Note: For functions, one input maps to one output. So we usually replace.
        // But let's allow "Relational" mapping first then constrain if needed?
        // Let's enforce Function property by default: One source maps to at most one target?
        // Or let user build freely and we tell them if it's a function.

        setMappings(prev => {
          // Remove existing mapping from this source if any
          const result = prev.filter(m => !(m.fromId === selectedSource && m.toId === element.id));
          if (result.length === prev.length) {
            // Add new
            // Optional: Enforce single mapping for function mode? 
            // Let's not enforce strictly so user can see "Not a function" error if they map one to many.
            return [...prev, { fromId: selectedSource, toId: element.id }];
          }
          return result;
        });
        // Keep selected source active to allow multi-mapping (for relations) or easy switching?
        // Let's maintain selection for easy editing.
      }
    }
  };

  const clearMappings = () => {
    if (selectedSource) {
      setMappings(prev => prev.filter(m => m.fromId !== selectedSource));
    } else {
      setMappings([]);
    }
  };

  const resetAll = () => {
    setSetA(SET_A_DEFAULT);
    setSetB(SET_B_DEFAULT);
    setMappings(DEFAULT_MAPPINGS);
    setSelectedSource(null);
  };

  // --- Properties Analysis ---

  const analysis = useMemo(() => {

    // 1. Check if Function (Left-total and Right-unique)
    // Actually, in set theory, a "function" must map every element in domain.
    // Let's assume standard definition: f: A -> B is a relation where:
    //  - For every x in A, there exists a unique y in B. (Total function)

    const sourceCounts = new Map<string, number>();
    setA.forEach(a => sourceCounts.set(a.id, 0));
    mappings.forEach(m => {
      sourceCounts.set(m.fromId, (sourceCounts.get(m.fromId) || 0) + 1);
    });

    const isRightUnique = Array.from(sourceCounts.values()).every(count => count <= 1);
    const isLeftTotal = Array.from(sourceCounts.values()).every(count => count >= 1);
    const isFunction = isRightUnique && isLeftTotal; // Total Function
    const isPartialFunction = isRightUnique; // Partial Function

    // 2. Injective (One-to-One)
    // Distinct elements of A map to distinct elements of B.
    // i.e., No element in B is mapped to by more than one element in A.
    const targetCounts = new Map<string, number>();
    setB.forEach(b => targetCounts.set(b.id, 0));
    mappings.forEach(m => {
      targetCounts.set(m.toId, (targetCounts.get(m.toId) || 0) + 1);
    });
    const isInjective = isFunction && Array.from(targetCounts.values()).every(count => count <= 1);

    // 3. Surjective (Onto)
    // Every element in B is mapped to by at least one element in A.
    const isSurjective = isFunction && Array.from(targetCounts.values()).every(count => count >= 1);

    // 4. Bijective
    const isBijective = isInjective && isSurjective;


    // --- Homomorphism Analysis ---
    // Check if f(a1 -> a2) implies f(a1) -> f(a2)
    // For every relation (u, v) in A, is there a relation (f(u), f(v)) in B?
    let isHomomorphism = false;
    let isIsomorphism = false;
    let homoFailReason = "";

    if (mode === 'homomorphism') {
      if (!isFunction) {
        homoFailReason = "Must be a total function first.";
      } else {
        // Create map for easy lookup
        const funcMap = new Map<string, string>();
        mappings.forEach(m => funcMap.set(m.fromId, m.toId));

        let holds = true;
        // Check all relations in A
        for (const relA of RELATION_A) {
          const u = relA.fromId;
          const v = relA.toId;
          const f_u = funcMap.get(u);
          const f_v = funcMap.get(v);

          if (f_u && f_v) {
            // Check if relation (f_u, f_v) exists in B
            const existsInB = RELATION_B.some(rb => rb.fromId === f_u && rb.toId === f_v);
            if (!existsInB) {
              holds = false;
              homoFailReason = `Preservation failed: ${relA.fromId}→${relA.toId} in A, but ${f_u}↛${f_v} in B`;
              break;
            }
          }
        }
        if (holds) {
          isHomomorphism = true;
          if (isBijective) {
            // Start Isomorphism check: Inverse is also homomorphism
            // For Isomorphism, structure must be exactly preserved (both ways)
            // If A->B is bijective homomorphism, we just need to check B->A is homomorphism.
            // Or simpler: For every relation in B, pre-images must be related in A.
            // Actually, for simple graphs, Isomorphism <=> Bijective Homomorphism AND Inverse is Homomorphism.
            let invHolds = true;
            // Construct inverse map
            const invMap = new Map<string, string>();
            mappings.forEach(m => invMap.set(m.toId, m.fromId));

            for (const relB of RELATION_B) {
              const x = relB.fromId;
              const y = relB.toId;
              const g_x = invMap.get(x);
              const g_y = invMap.get(y);

              if (g_x && g_y) {
                const existsInA = RELATION_A.some(ra => ra.fromId === g_x && ra.toId === g_y);
                if (!existsInA) {
                  invHolds = false;
                  homoFailReason = "Isomorphism failed: Inverse does not preserve structure.";
                  break;
                }
              }
            }
            if (invHolds) isIsomorphism = true;
          }
        }
      }
    }

    return {
      isLeftTotal,
      isRightUnique,
      isFunction,
      isPartialFunction,
      isInjective,
      isSurjective,
      isBijective,
      isHomomorphism,
      isIsomorphism,
      homoFailReason,
      sourceCounts,
      targetCounts
    };
  }, [setA, setB, mappings, mode]);

  // --- Rendering ---

  const svgRef = useRef<SVGSVGElement>(null);

  // Helper to draw arrow
  const renderArrow = (x1: number, y1: number, x2: number, y2: number, color: string = "#64748b", dashed = false) => {
    // Offset endpoints by radius
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const r = 20; // radius of node
    const startX = x1 + r * Math.cos(angle);
    const startY = y1 + r * Math.sin(angle);
    const endX = x2 - r * Math.cos(angle);
    const endY = y2 - r * Math.sin(angle);

    return (
      <g key={`${x1}-${y1}-${x2}-${y2}`}>
        <line
          x1={startX} y1={startY}
          x2={endX} y2={endY}
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? "5,5" : "0"}
          markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
        />
      </g>
    );
  };

  const controls = (
    <div className="flex flex-col gap-4">

      <div className="space-y-2">
        <label className="text-sm font-medium">{t.mode}</label>
        <div className="flex flex-col gap-2">
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${mode === 'mapping' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            onClick={() => setMode('mapping')}
          >
            {t.mappingMode}
          </button>
          <button
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${mode === 'homomorphism' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            onClick={() => setMode('homomorphism')}
          >
            {t.morphismMode}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t.actions}</label>
        <div className="flex gap-2">
          <button
            onClick={clearMappings} // Now dynamic based on selection
            className="flex-1 px-3 py-2 rounded text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium transition-colors"
          >
            {selectedSource ? t.clearSelected : t.clearAll}
          </button>
          <button
            onClick={resetAll}
            className="flex-1 px-3 py-2 rounded text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t.analysis}</label>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <StatusBadge
            label={t.functionTotal}
            active={analysis.isFunction}
            inactiveLabel={!analysis.isRightUnique ? t.notFunction : t.partialFunction}
          />
          <StatusBadge
            label={t.injective}
            active={analysis.isInjective}
            disabled={!analysis.isFunction}
          />
          <StatusBadge
            label={t.surjective}
            active={analysis.isSurjective}
            disabled={!analysis.isFunction}
          />
          <StatusBadge
            label={t.bijective}
            active={analysis.isBijective}
            disabled={!analysis.isFunction}
          />
          {mode === 'homomorphism' && (
            <>
              <StatusBadge
                label={t.homomorphism}
                active={analysis.isHomomorphism}
                disabled={!analysis.isFunction}
                reason={analysis.homoFailReason}
              />
              <StatusBadge
                label={t.isomorphism}
                active={analysis.isIsomorphism}
                disabled={!analysis.isFunction}
              />
            </>
          )}
        </div>
      </div>

      {mode === 'homomorphism' && (
        <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {t.structureNote}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  const visualization = (
    <div className="bg-background rounded-lg shadow-sm border overflow-hidden relative w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 500 450" className="select-none max-w-[600px]">
        <defs>
          <marker id="arrowhead-cbd5e1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
          </marker>
          <marker id="arrowhead-64748b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrowhead-3b82f6" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowhead-888888" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#888888" />
          </marker>
        </defs>

        {/* Groups Backgrounds */}
        <rect x="20" y="20" width="150" height="400" rx="15" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="5,5" />
        <text x="95" y="40" textAnchor="middle" className="font-bold text-slate-400">{t.setA}</text>

        <rect x="320" y="20" width="150" height="400" rx="15" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="5,5" />
        <text x="395" y="40" textAnchor="middle" className="font-bold text-slate-400">{t.setB}</text>
        {mode === 'homomorphism' && (
          <>
            {/* Relations in A */}
            {RELATION_A.map((rel) => {
              const u = setA.find(el => el.id === rel.fromId);
              const v = setA.find(el => el.id === rel.toId);
              if (u && v) return renderArrow(u.x, u.y, v.x, v.y, "#cbd5e1", true); // light distinct color
              return null;
            })}
            {/* Relations in B */}
            {RELATION_B.map((rel) => {
              const u = setB.find(el => el.id === rel.fromId);
              const v = setB.find(el => el.id === rel.toId);
              if (u && v) return renderArrow(u.x, u.y, v.x, v.y, "#cbd5e1", true);
              return null;
            })}
          </>
        )}

        {/* Mappings */}
        {mappings.map((m) => {
          const source = setA.find(el => el.id === m.fromId);
          const target = setB.find(el => el.id === m.toId);
          if (!source || !target) return null;

          const color = selectedSource === m.fromId ? "#3b82f6" : "#64748b";
          return renderArrow(source.x, source.y, target.x, target.y, color, false);
        })}

        {/* Nodes Set A */}
        {setA.map(el => (
          <g
            key={el.id}
            onClick={() => handleElementClick(el, true)}
            className="cursor-pointer hover:opacity-80"
          >
            <circle
              cx={el.x} cy={el.y} r="20"
              fill={selectedSource === el.id ? "#bfdbfe" : "white"}
              stroke={selectedSource === el.id ? "#3b82f6" : "#94a3b8"}
              strokeWidth={selectedSource === el.id ? 3 : 2}
            />
            <text x={el.x} y={el.y} dy="5" textAnchor="middle" className="text-sm font-medium select-none pointer-events-none">{el.label}</text>

            {/* Validation badges per node */}
            {!analysis.isRightUnique && (analysis.sourceCounts.get(el.id) || 0) > 1 && (
              <text x={el.x - 30} y={el.y} fill="red" fontSize="20">!</text>
            )}
          </g>
        ))}

        {/* Nodes Set B */}
        {setB.map(el => (
          <g
            key={el.id}
            onClick={() => handleElementClick(el, false)}
            className="cursor-pointer hover:opacity-80"
          >
            <circle cx={el.x} cy={el.y} r="20" fill="white" stroke="#94a3b8" strokeWidth="2" />
            <text x={el.x} y={el.y} dy="5" textAnchor="middle" className="text-sm font-medium select-none pointer-events-none">{el.label}</text>
          </g>
        ))}

        {/* Temporary Line when dragging/selecting */}
        {selectedSource && (() => {
          // We can't easily track mouse here without listener on SVG. 
          // Simple UX: Just highlight source, then click target. No rubberbanding for now to keep it simple.
          return null;
        })()}

      </svg>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded-full opacity-75 pointer-events-none whitespace-nowrap">
        {selectedSource
          ? t.selectHint.replace('{label}', setA.find(a => a.id === selectedSource)?.label || '')
          : t.clickHint}
      </div>
    </div>
  );

  const documentation = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4" {...props} />,
        h2: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
        h3: ({ node, ...props }) => <h4 className="text-lg font-medium mt-4 mb-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
      }}
    >
      {lang === 'zh' ? docsZh : docsEn}
    </ReactMarkdown>
  );

  return (
    <ProjectLayout
      title={lang === 'zh' ? "集合映射与同态" : "Function Mappings & Morphisms"}
      controls={controls}
      visualization={visualization}
      documentation={documentation}
      lang={lang}
      setLang={setLang}
    />
  );
}

function StatusBadge({
  label,
  active,
  disabled = false,
  reason,
  inactiveLabel
}: {
  label: string,
  active: boolean,
  disabled?: boolean,
  reason?: string,
  inactiveLabel?: string
}) {
  if (disabled) {
    return (
      <div className="flex flex-col border border-slate-100 bg-slate-50 p-2 rounded opacity-50">
        <span className="font-semibold text-slate-400">{label}</span>
        <span className="text-xs text-slate-400">-</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col border p-2 rounded transition-colors ${active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className={`font-semibold ${active ? 'text-green-700' : 'text-red-700'}`}>{label}</span>
      </div>
      {!active && (
        <span className="text-xs text-red-600 mt-1">
          {reason || inactiveLabel || "Condition not met"}
        </span>
      )}
      {active && (
        <span className="text-xs text-green-600 mt-1">
          True
        </span>
      )}
    </div>
  );
}
