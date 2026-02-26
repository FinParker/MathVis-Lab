import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
// @ts-ignore
import docsEn from './docs.md?raw';
// @ts-ignore
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

const TRANSLATIONS = {
  en: {
    title: "Category Morphisms",
    instruction: "Drag from A to B to define f.",

    monoTitle: "1. Monomorphism (Left Cancellable)",
    monoDef: "f ∘ g₁ = f ∘ g₂ ⇒ g₁ = g₂",
    monoPass: "✅ MONO: Injective. Left-cancellable.",
    monoFail: "❌ NOT MONO: Not injective. Found g₁ ≠ g₂ where f ∘ g₁ = f ∘ g₂.",

    epiTitle: "2. Epimorphism (Right Cancellable)",
    epiDef: "h₁ ∘ f = h₂ ∘ f ⇒ h₁ = h₂",
    epiPass: "✅ EPI: Surjective. Right-cancellable.",
    epiFail: "❌ NOT EPI: Not surjective. Found h₁ ≠ h₂ where h₁ ∘ f = h₂ ∘ f.",

    reset: "Reset Mapping",
    clear: "Clear All",
  },
  zh: {
    title: "范畴论态射",
    instruction: "在区域内滑动连接 A 到 B 来定义函数 f。",

    monoTitle: "1. 单态射 (左可消 Left Cancellable)",
    monoDef: "若 f ∘ g₁ = f ∘ g₂ 则 g₁ = g₂",
    monoPass: "✅ 是单态射: 单射 (Injective)。满足左消去律。",
    monoFail: "❌ 非单态射: 非单射。存在 g₁ ≠ g₂ 但 f ∘ g₁ = f ∘ g₂。",

    epiTitle: "2. 满态射 (右可消 Right Cancellable)",
    epiDef: "若 h₁ ∘ f = h₂ ∘ f 则 h₁ = h₂",
    epiPass: "✅ 是满态射: 满射 (Surjective)。满足右消去律。",
    epiFail: "❌ 非满态射: 非满射。存在 h₁ ≠ h₂ 但 h₁ ∘ f = h₂ ∘ f。",

    reset: "重置映射",
    clear: "清除所有",
  }
};

export default function MorphismsProject() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const t = TRANSLATIONS[lang];

  // --- State ---

  // Layout: Z -> A -> B -> Y
  const zX = 40;
  const aX = 140;
  const bX = 260;
  const yX = 360;

  const [setA] = useState<SetElement[]>([
    { id: 'a1', label: 'a₁', x: aX, y: 80 },
    { id: 'a2', label: 'a₂', x: aX, y: 150 },
    { id: 'a3', label: 'a₃', x: aX, y: 220 },
  ]);
  const [setB] = useState<SetElement[]>([
    { id: 'b1', label: 'b₁', x: bX, y: 80 },
    { id: 'b2', label: 'b₂', x: bX, y: 150 },
    { id: 'b3', label: 'b₃', x: bX, y: 220 },
  ]);

  // Test Object Z = {*}
  const setZ = [{ id: 'z1', label: '*', x: zX, y: 150 }];

  // Test Object Y = {0, 1}
  const setY = [
    { id: 'y0', label: '0', x: yX, y: 120 },
    { id: 'y1', label: '1', x: yX, y: 180 },
  ];

  // Initial mapping f: A -> B (Bijective start)
  const [mappings, setMappings] = useState<Mapping[]>([
    { fromId: 'a1', toId: 'b1' },
    { fromId: 'a2', toId: 'b2' },
    { fromId: 'a3', toId: 'b3' },
  ]);

  // Analysis
  const analysis = useMemo(() => {
    // Build map for f
    const fMap = new Map<string, string>();
    mappings.forEach(m => fMap.set(m.fromId, m.toId));

    // Is Function? (Total)
    const isTotal = setA.every(a => fMap.has(a.id));

    // --- 1. Check Monomorphism ---
    // If collision: f(x) = f(y) = z. 
    // Counter-example Z={*}, g1(*)=x, g2(*)=y.
    const targetCounts = new Map<string, string[]>(); // bId -> [aId, aId...]
    setB.forEach(b => targetCounts.set(b.id, []));
    mappings.forEach(m => {
      targetCounts.get(m.toId)?.push(m.fromId);
    });

    const collisionEntry = Array.from(targetCounts.entries()).find(([, v]) => v.length > 1);
    const isMono = isTotal && !collisionEntry;

    // Counter-example g1, g2
    let g1Target = null, g2Target = null;
    if (collisionEntry) {
      g1Target = collisionEntry[1][0]; // First 'a' mapping to collision
      g2Target = collisionEntry[1][1]; // Second 'a' mapping to collision
    }

    // --- 2. Check Epimorphism ---
    // If missed: y not in Im(f).
    // Counter-example Y={0,1}, h1(b)=0, h2(y)=1 else 0.
    const missedNode = Array.from(targetCounts.entries()).find(([, v]) => v.length === 0)?.[0];
    const isEpi = isTotal && !missedNode;

    return { isTotal, isMono, isEpi, collisionNode: collisionEntry?.[0], g1Target, g2Target, missedNode };
  }, [setA, setB, mappings]);

  const handleToggleMapping = (aId: string, bId: string) => {
    setMappings(prev => {
      const filtered = prev.filter(m => m.fromId !== aId);
      return [...filtered, { fromId: aId, toId: bId }];
    });
  };

  const reset = () => {
    setMappings([
      { fromId: 'a1', toId: 'b1' },
      { fromId: 'a2', toId: 'b2' },
      { fromId: 'a3', toId: 'b3' },
    ]);
  };
  const clear = () => setMappings([]);

  // --- Counter Example Lines ---
  const gLines: any[] = [];
  if (!analysis.isMono && analysis.g1Target && analysis.g2Target) {
    // g1: Z -> A maps * to g1Target
    const t1 = setA.find(a => a.id === analysis.g1Target);
    if (t1) gLines.push({ type: 'g1', start: setZ[0], end: t1, color: '#f59e0b', label: 'g₁' });

    // g2: Z -> A maps * to g2Target
    const t2 = setA.find(a => a.id === analysis.g2Target);
    if (t2) gLines.push({ type: 'g2', start: setZ[0], end: t2, color: '#ec4899', label: 'g₂' });
  }

  const hLines: any[] = [];
  if (!analysis.isEpi && analysis.missedNode) {
    // h1 is const 0 for all B.
    // h2 is characteristic function for missedNode (1 at missedNode, 0 elsewhere).
    // To visualize clearly, we show h1 and h2 diverting at missedNode.

    // For missedNode: h1 -> 0, h2 -> 1
    const missedB = setB.find(b => b.id === analysis.missedNode);
    if (missedB) {
      hLines.push({ type: 'h1', start: missedB, end: setY[0], color: '#f59e0b', label: 'h₁' });
      hLines.push({ type: 'h2', start: missedB, end: setY[1], color: '#ec4899', label: 'h₂' });
    }

    // For other nodes? 
    // Showing lines for ALL nodes makes it messy. The contradiction happens AT the missed node.
    // So we only draw the arrows from the missed node to show h1 != h2.
  }


  const Controls = (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <button onClick={reset} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm">{t.reset}</button>
        <button onClick={clear} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm">{t.clear}</button>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
          {t.instruction}
        </div>

        {/* Mono Status */}
        <div className={`p-4 rounded border transition-colors ${analysis.isMono ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-bold text-sm mb-1">{t.monoTitle}</div>
          <div className="font-mono text-xs text-muted-foreground mb-3 bg-white/50 p-1 rounded border border-black/5">{t.monoDef}</div>
          <div className={`text-sm ${analysis.isMono ? 'text-green-700' : 'text-red-700'}`}>
            {analysis.isMono ? t.monoPass : t.monoFail}
          </div>
          {!analysis.isMono && (
            <div className="mt-2 text-xs text-red-600 bg-red-100/50 p-2 rounded">
              {lang === 'zh' ?
                `反例: 取 Z={*}, g₁(*) = ${setA.find(a => a.id === analysis.g1Target)?.label}, g₂(*) = ${setA.find(a => a.id === analysis.g2Target)?.label}` :
                `Example: Let Z={*}, g₁(*) = ${setA.find(a => a.id === analysis.g1Target)?.label}, g₂(*) = ${setA.find(a => a.id === analysis.g2Target)?.label}`
              }
            </div>
          )}
        </div>

        {/* Epi Status */}
        <div className={`p-4 rounded border transition-colors ${analysis.isEpi ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-bold text-sm mb-1">{t.epiTitle}</div>
          <div className="font-mono text-xs text-muted-foreground mb-3 bg-white/50 p-1 rounded border border-black/5">{t.epiDef}</div>
          <div className={`text-sm ${analysis.isEpi ? 'text-green-700' : 'text-red-700'}`}>
            {analysis.isEpi ? t.epiPass : t.epiFail}
          </div>
          {!analysis.isEpi && (
            <div className="mt-2 text-xs text-red-600 bg-red-100/50 p-2 rounded">
              {lang === 'zh' ?
                `反例: 取 Y={0,1}, h₁是常函数0, h₂在 ${setB.find(b => b.id === analysis.missedNode)?.label} 处取1` :
                `Example: Let Y={0,1}, h₁ is const 0, h₂ is 1 at ${setB.find(b => b.id === analysis.missedNode)?.label}`
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full bg-background rounded-lg border relative flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 400 300" className="select-none">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
          </marker>
          <marker id="arrow-g1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
          <marker id="arrow-g2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
          </marker>
          <marker id="arrow-h1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
          <marker id="arrow-h2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
          </marker>
        </defs>

        {/* --- Containers --- */}

        {/* Z Container (only visible if Not Mono) */}
        <g opacity={!analysis.isMono ? 1 : 0.1}>
          <rect x={zX - 25} y={100} width="50" height="100" rx="10" fill="#fffbeb" stroke="#f59e0b" strokeDasharray="5,5" />
          <text x={zX} y={90} textAnchor="middle" className="font-bold fill-slate-400">Z</text>
          {/* Z Nodes */}
          {setZ.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="10" fill="white" stroke="#94a3b8" />
              <text x={n.x} y={n.y} dy="4" textAnchor="middle" className="text-xs">{n.label}</text>
            </g>
          ))}
        </g>

        {/* A Container */}
        <rect x={aX - 40} y={40} width="80" height="240" rx="20" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x={aX} y={30} textAnchor="middle" className="font-bold fill-slate-600">A</text>

        {/* B Container */}
        <rect x={bX - 40} y={40} width="80" height="240" rx="20" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        <text x={bX} y={30} textAnchor="middle" className="font-bold fill-slate-600">B</text>

        {/* Y Container (only visible if Not Epi) */}
        <g opacity={!analysis.isEpi ? 1 : 0.1}>
          <rect x={yX - 25} y={90} width="50" height="150" rx="10" fill="#fffbeb" stroke="#f59e0b" strokeDasharray="5,5" />
          <text x={yX} y={80} textAnchor="middle" className="font-bold fill-slate-400">Y</text>
          {/* Y Nodes */}
          {setY.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="10" fill="white" stroke="#94a3b8" />
              <text x={n.x} y={n.y} dy="4" textAnchor="middle" className="text-xs">{n.label}</text>
            </g>
          ))}
        </g>

        {/* --- Links --- */}

        {/* g Lines (Z -> A) */}
        {gLines.map((l, i) => (
          <path
            key={`g-${i}`}
            d={`M ${l.start.x} ${l.start.y} Q ${l.start.x + 50} ${l.type === 'g1' ? l.start.y - 20 : l.start.y + 20} ${l.end.x} ${l.end.y}`}
            fill="none" stroke={l.color} strokeWidth="2" markerEnd={`url(#arrow-${l.type})`}
          />
        ))}

        {/* f Lines (A -> B) */}
        {mappings.map((m, i) => {
          const s = setA.find(a => a.id === m.fromId);
          const t = setB.find(b => b.id === m.toId);
          if (!s || !t) return null;
          return (
            <line
              key={`f-${i}`}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"
            />
          );
        })}

        {/* h Lines (B -> Y) */}
        {hLines.map((l, i) => (
          <path
            key={`h-${i}`}
            d={`M ${l.start.x} ${l.start.y} Q ${l.start.x + 50} ${l.type === 'h1' ? l.end.y - 10 : l.end.y + 10} ${l.end.x} ${l.end.y}`}
            fill="none" stroke={l.color} strokeWidth="2" markerEnd={`url(#arrow-${l.type})`}
            strokeDasharray={l.type === 'h1' ? "3,3" : "none"}
          />
        ))}

        {/* --- Nodes --- */}

        {/* A Nodes */}
        {setA.map(n => (
          <g key={n.id} className="cursor-pointer">
            <circle cx={n.x} cy={n.y} r="15" fill="white" stroke="#334155" strokeWidth="2" />
            <text x={n.x} y={n.y} dy="5" textAnchor="middle" className="text-sm font-medium select-none">{n.label}</text>
          </g>
        ))}

        {/* B Nodes */}
        {setB.map(n => (
          <g key={n.id} className="cursor-pointer">
            <circle
              cx={n.x} cy={n.y} r="15"
              fill={analysis.missedNode === n.id ? "#fee2e2" : "white"}
              stroke={analysis.collisionNode === n.id && !analysis.isMono ? "#f59e0b" : (analysis.missedNode === n.id ? "#ef4444" : "#334155")}
              strokeWidth="2"
            />
            <text x={n.x} y={n.y} dy="5" textAnchor="middle" className="text-sm font-medium select-none">{n.label}</text>
            {analysis.missedNode === n.id && <text x={n.x + 25} y={n.y} fill="#ef4444" fontSize="10">Missed</text>}
          </g>
        ))}


        {/* --- Interactions Overlay --- */}
        {/* We create a large clickable area for pairs A-B. 
                    However, simplistic 'rect' overlap might be annoying.
                    Let's just use the current logic but make sure clipPaths are correct or use simpler overlay.
                    Using invisible lines or rects spanning.
                */}

        {setA.map(a => (
          setB.map(b => (
            <path
              key={`click-${a.id}-${b.id}`}
              d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${b.x} ${b.y + 30} L ${a.x} ${a.y + 30} Z`} // Roughly
              fill="transparent"
              className="hover:fill-blue-500/10 cursor-pointer"
              onClick={() => handleToggleMapping(a.id, b.id)}
            />
          ))
        ))}

      </svg>
    </div>
  );

  const documentation = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4" {...props} />,
        h2: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
        p: ({ node, ...props }) => <p className="leading-relaxed mb-4" {...props} />,
      }}
    >
      {lang === 'zh' ? docsZh : docsEn}
    </ReactMarkdown>
  );

  return (
    <ProjectLayout
      title={t.title}
      controls={Controls}
      visualization={visualization}
      documentation={documentation}
      lang={lang}
      setLang={setLang}
    />
  );
}
