import { useState } from 'react';

// Simple Node Type
type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'top' | 'bottom' | 'normal' | 'join' | 'meet';
  description?: string;
};

type Link = {
  source: string;
  target: string;
};

const nodes: Node[] = [
  { id: 'top', x: 200, y: 50, label: '⊤ (Top/Any/Object)', type: 'top', description: 'Universal Supertype' },
  { id: 'animal', x: 100, y: 150, label: 'Animal', type: 'normal', description: 'Interface / Trait' },
  { id: 'flyable', x: 300, y: 150, label: 'Flyable', type: 'normal', description: 'Interface / Trait' },
  { id: 'bird', x: 200, y: 250, label: 'Bird', type: 'join', description: 'Implements Animal & Flyable' },
  { id: 'dog', x: 50, y: 250, label: 'Dog', type: 'normal', description: 'Implements Animal' },
  { id: 'plane', x: 350, y: 250, label: 'Plane', type: 'normal', description: 'Implements Flyable' },
  { id: 'bottom', x: 200, y: 350, label: '⊥ (Bottom/Never)', type: 'bottom', description: 'Universal Subtype (No value)' },
];

const links: Link[] = [
  { source: 'animal', target: 'top' },
  { source: 'flyable', target: 'top' },
  { source: 'bird', target: 'animal' },
  { source: 'bird', target: 'flyable' },
  { source: 'dog', target: 'animal' },
  { source: 'plane', target: 'flyable' },
  { source: 'bottom', target: 'bird' },
  { source: 'bottom', target: 'dog' },
  { source: 'bottom', target: 'plane' },
];

export const LatticeDiagram = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center bg-slate-50 p-6 rounded-xl border mt-4">
      <h3 className="text-lg font-bold mb-4">Type Lattice Structure (Hasse Diagram)</h3>
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400" className="overflow-visible">
          {/* Links */}
          {links.map((link, i) => {
            const start = nodes.find(n => n.id === link.source)!;
            const end = nodes.find(n => n.id === link.target)!;
            const isRelated = hoveredNode ? (hoveredNode === start.id || hoveredNode === end.id) : false;

            return (
              <line
                key={i}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isRelated ? "#3b82f6" : "#cbd5e1"}
                strokeWidth={isRelated ? 3 : 2}
                opacity={hoveredNode && !isRelated ? 0.2 : 1}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 30 : 25}
                  fill={node.type === 'top' ? '#fecaca' : node.type === 'bottom' ? '#bfdbfe' : '#e2e8f0'}
                  stroke={isHovered ? '#1e293b' : '#94a3b8'}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy={4}
                  textAnchor="middle"
                  className={`text-[10px] font-medium pointer-events-none select-none ${isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-600'}`}
                >
                  {node.label.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip Area */}
        <div className="h-20 mt-4 text-center">
          {hoveredNode ? (
            <div className="inline-block p-3 bg-white border border-slate-200 shadow-lg rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="font-bold text-slate-800">{nodes.find(n => n.id === hoveredNode)?.label}</div>
              <div className="text-sm text-slate-600">{nodes.find(n => n.id === hoveredNode)?.description}</div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 italic">Hover over nodes to see details</div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 max-w-md text-center">
        Notes: Arrows are implied upwards ($\le$). <br />
        Join ($A \vee B$) is the "lowest" node above both A and B.<br />
        Meet ($A \wedge B$) is the "highest" node below both A and B.
      </div>
    </div>
  );
};
