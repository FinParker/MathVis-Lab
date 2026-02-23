import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
// @ts-ignore
import docsEn from './docs.md?raw';
// @ts-ignore
import docsZh from './docs_zh.md?raw';

type Mode = '2d' | '3d';

interface Point2D { x: number; y: number; }
interface Point3D { x: number; y: number; z: number; }

const TRANSLATIONS = {
  en: {
    mode: "Mode",
    mode2D: "2D Rotation SO(2)",
    mode3D: "3D Rotation SO(3)",
    angle: "Angle θ (Theta)",
    point: "Point P(x, y)",
    controls: "Controls",
    matrix: "Rotation Matrix",
    calculated: "Calculated Position P'",
    original: "Original Position P",
    reset: "Reset",
    axes: "Axes",
    x: "X", y: "Y", z: "Z",
    alpha: "α (Around X)",
    beta: "β (Around Y)",
    gamma: "γ (Around Z)",
  },
  zh: {
    mode: "模式",
    mode2D: "2D 旋转 SO(2)",
    mode3D: "3D 旋转 SO(3)",
    angle: "旋转角 θ (Theta)",
    point: "坐标点 P(x, y)",
    controls: "控制面板",
    matrix: "旋转矩阵 (Rotation Matrix)",
    calculated: "变换后位置 P'",
    original: "原始位置 P",
    reset: "重置",
    axes: "坐标轴",
    x: "X", y: "Y", z: "Z",
    alpha: "α (绕 X 轴)",
    beta: "β (绕 Y 轴)",
    gamma: "γ (绕 Z 轴)",
  }
};

export default function RotationMatrixProject() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<Mode>('2d');

  // 2D State
  const [angle2D, setAngle2D] = useState(45); // degrees
  const [point2D, setPoint2D] = useState<Point2D>({ x: 100, y: 50 });

  // 3D State
  const [angles3D, setAngles3D] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [point3D] = useState<Point3D>({ x: 50, y: 50, z: 50 });
  // --- 2D Logic ---
  const rad2D = angle2D * Math.PI / 180;
  const cos2D = Math.cos(rad2D);
  const sin2D = Math.sin(rad2D);

  const rotatedPoint2D = useMemo(() => {
    return {
      x: point2D.x * cos2D - point2D.y * sin2D,
      y: point2D.x * sin2D + point2D.y * cos2D
    };
  }, [point2D, angle2D]);

  // --- 3D Logic ---
  // Rotation Matrices
  const rad3D = {
    alpha: angles3D.alpha * Math.PI / 180,
    beta: angles3D.beta * Math.PI / 180,
    gamma: angles3D.gamma * Math.PI / 180,
  };

  // Calculate R = Rz(g) * Ry(b) * Rx(a) (Intrinsic Z-Y-X or Extrinsic? Let's just do individual or composed)
  // For visualization, we'll apply them in order: Rx then Ry then Rz usually.
  // Or just one total matrix.
  // Let's compute the final transformed point manually step-by-step for clarity if needed, or just final.

  // Rx
  const Rx = [
    [1, 0, 0],
    [0, Math.cos(rad3D.alpha), -Math.sin(rad3D.alpha)],
    [0, Math.sin(rad3D.alpha), Math.cos(rad3D.alpha)]
  ];
  // Ry
  const Ry = [
    [Math.cos(rad3D.beta), 0, Math.sin(rad3D.beta)],
    [0, 1, 0],
    [-Math.sin(rad3D.beta), 0, Math.cos(rad3D.beta)]
  ];
  // Rz
  const Rz = [
    [Math.cos(rad3D.gamma), -Math.sin(rad3D.gamma), 0],
    [Math.sin(rad3D.gamma), Math.cos(rad3D.gamma), 0],
    [0, 0, 1]
  ];

  // Helper: Matrix vector multiply
  const matVecMul = (m: number[][], v: Point3D): Point3D => {
    return {
      x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
      y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
      z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z,
    };
  };

  const applyRotation3D = (p: Point3D) => {
    let res = p;
    // Apply Rx, then Ry, then Rz
    res = matVecMul(Rx, res);
    res = matVecMul(Ry, res);
    res = matVecMul(Rz, res);
    return res;
  };

  const rotatedPoint3D = useMemo(() => applyRotation3D(point3D), [point3D, angles3D]);

  // --- Visualization Helpers ---

  // 2D Coord System
  const Origin2D = { x: 200, y: 200 }; // Center of SVG

  // 3D Projection (Simple Perspective)
  const project3D = (p: Point3D) => {
    // Simple isometric-like projection for clarity OR perspective
    // Let's use a fixed camera view for the "World".
    // World coordinates: X Right, Y Up, Z Forward (Right Handed?)
    // Let's standard: X Right, Y Up, Z Out of screen.

    // But to see 3D structure, we view from an angle.
    // View Angle: 

    // Rotate point by View Angles (inverse of camera) to get Camera Space
    // We can just use a simple cabinet or isometric projection formula.
    // Iso: x_screen = (x - z) * cos(30), y_screen = y + (x+z) * sin(30) ...

    // Let's use simple perspective:
    // Eye at (200, 200, 500) looking at (0,0,0)

    // Simpler: Orthographic projection with slight rotation
    // x_proj = x * 0.866 - z * 0.5
    // y_proj = y - x * 0.5 * 0.5 - z * 0.5 * 0.5 ... confusing.

    // Using fixed rotation matrix for "Camera View"
    const isoX = (p.x - p.z) * Math.cos(Math.PI / 6);
    const isoY = p.y - (p.x + p.z) * Math.sin(Math.PI / 6);

    return {
      x: 250 + isoX, // Center X
      y: 250 - isoY  // Center Y (Invert Y for screen coords)
    };
  };

  /* // Axes for 3D (Unused currently as we draw manually)
      const AxesPoints = [
          { x: 0, y: 0, z: 0 },
          { x: 150, y: 0, z: 0 }, 
          { x: 0, y: 150, z: 0 }, 
          { x: 0, y: 0, z: 150 }, 
      ]; */
  // const AxesProj = AxesPoints.map(project3D);

  // --- Render ---

  const Controls = (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setMode('2d')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === '2d' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {t.mode2D}
        </button>
        <button
          onClick={() => setMode('3d')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === '3d' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {t.mode3D}
        </button>
      </div>

      {mode === '2d' ? (
        /* 2D Controls */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t.angle}</label>
              <span className="text-sm font-mono">{angle2D}°</span>
            </div>
            <input
              type="range" min="-180" max="180" step="1"
              value={angle2D} onChange={e => setAngle2D(Number(e.target.value))}
              className="w-full"
            />
          </div >

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.point}</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">X</span>
                <input
                  type="number" value={point2D.x}
                  onChange={e => setPoint2D({ ...point2D, x: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Y</span>
                <input
                  type="number" value={point2D.y}
                  onChange={e => setPoint2D({ ...point2D, y: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-card border rounded-md font-mono text-xs space-y-1">
            <div className="font-semibold text-muted-foreground mb-1">{t.matrix}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-center">
              <div className="bg-muted/50 p-1 rounded">{cos2D.toFixed(3)}</div>
              <div className="bg-muted/50 p-1 rounded">{-sin2D.toFixed(3)}</div>
              <div className="bg-muted/50 p-1 rounded">{sin2D.toFixed(3)}</div>
              <div className="bg-muted/50 p-1 rounded">{cos2D.toFixed(3)}</div>
            </div>
          </div>

          <div className="p-3 bg-muted/20 border rounded-md font-mono text-xs space-y-2">
            <div>
              <span className="text-muted-foreground mr-2">P :</span>
              [{point2D.x}, {point2D.y}]
            </div>
            <div>
              <span className="text-primary mr-2">P':</span>
              [{rotatedPoint2D.x.toFixed(1)}, {rotatedPoint2D.y.toFixed(1)}]
            </div>
          </div>
        </div >
      ) : (
        /* 3D Controls */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>{t.alpha}</label>
              <span>{angles3D.alpha}°</span>
            </div>
            <input
              type="range" min="-180" max="180"
              value={angles3D.alpha} onChange={e => setAngles3D({ ...angles3D, alpha: Number(e.target.value) })}
              className="w-full accent-red-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>{t.beta}</label>
              <span>{angles3D.beta}°</span>
            </div>
            <input
              type="range" min="-180" max="180"
              value={angles3D.beta} onChange={e => setAngles3D({ ...angles3D, beta: Number(e.target.value) })}
              className="w-full accent-green-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>{t.gamma}</label>
              <span>{angles3D.gamma}°</span>
            </div>
            <input
              type="range" min="-180" max="180"
              value={angles3D.gamma} onChange={e => setAngles3D({ ...angles3D, gamma: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={() => setAngles3D({ alpha: 0, beta: 0, gamma: 0 })}
            className="w-full py-1 text-xs border rounded hover:bg-muted"
          >
            {t.reset}
          </button>

          <div className="p-3 bg-card border rounded-md font-mono text-[10px] space-y-1">
            <div className="font-semibold text-muted-foreground mb-1">Rotation Matrix (Comp.)</div>
            {/* Displaying composed matrix might be too large, let's just show coords */}
            <div>
              <span className="text-muted-foreground mr-2">P :</span>
              [{point3D.x.toFixed(0)}, {point3D.y.toFixed(0)}, {point3D.z.toFixed(0)}]
            </div>
            <div>
              <span className="text-primary mr-2">P':</span>
              [{rotatedPoint3D.x.toFixed(1)}, {rotatedPoint3D.y.toFixed(1)}, {rotatedPoint3D.z.toFixed(1)}]
            </div>
          </div>
        </div>
      )
      }
    </div >
  );

  // --- Render Visualization ---

  // 2D Vis
  const Vis2D = () => {
    const p = { x: Origin2D.x + point2D.x, y: Origin2D.y - point2D.y }; // SVG Y is down
    const pPrime = { x: Origin2D.x + rotatedPoint2D.x, y: Origin2D.y - rotatedPoint2D.y };

    return (
      <svg width="100%" height="100%" viewBox="0 0 400 400" className="select-none">
        <defs>
          <marker id="arrow-axis" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
          <marker id="arrow-vec" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrow-res" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Grid */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
        </pattern>
        <rect width="400" height="400" fill="url(#grid)" />

        {/* Axes */}
        <line x1="20" y1="200" x2="380" y2="200" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow-axis)" />
        <line x1="200" y1="380" x2="200" y2="20" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow-axis)" />
        <text x="385" y="200" className="text-xs fill-slate-400">X</text>
        <text x="200" y="15" className="text-xs fill-slate-400">Y</text>

        {/* Original Vector */}
        <line x1={Origin2D.x} y1={Origin2D.y} x2={p.x} y2={p.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx={p.x} cy={p.y} r="4" fill="#cbd5e1" />
        <text x={p.x + 10} y={p.y} className="text-xs fill-slate-400">P</text>

        {/* Rotated Vector */}
        <line x1={Origin2D.x} y1={Origin2D.y} x2={pPrime.x} y2={pPrime.y} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-res)" />
        <circle cx={pPrime.x} cy={pPrime.y} r="5" fill="#3b82f6" />
        <text x={pPrime.x + 10} y={pPrime.y} className="text-xs fill-blue-500 font-bold">P'</text>

        {/* Angle Arc (Simple Representation) */}
        {/* Visualizing the angle can be complex in SVG if we want it perfect. 
                    Simple approximation: text near center. 
                */}
        <text x="210" y="190" className="text-xs fill-muted-foreground italic">θ = {angle2D}°</text>
      </svg>
    );
  };

  const Vis3D = () => {
    const origin = project3D({ x: 0, y: 0, z: 0 });
    const p = project3D(rotatedPoint3D);

    return (
      <svg width="100%" height="100%" viewBox="0 0 500 500" className="select-none bg-slate-50/50">
        <defs>
          {/* Define markers for 3D axes */}
        </defs>

        {/* Origin */}
        <circle cx={origin.x} cy={origin.y} r="2" fill="#94a3b8" />

        {/* Standard Static Grid/Reference (optional)  */}

        {/* Rotatable Axes Visuals? 
                      Should we rotate axes or rotate point?
                      In "Rotation Matrix" usually we rotate the vector active. 
                      So Axes stay fixed.
                  */}

        {/* Fixed World Axes */}
        <line x1={origin.x} y1={origin.y} x2={project3D({ x: 150, y: 0, z: 0 }).x} y2={project3D({ x: 150, y: 0, z: 0 }).y} stroke="#ef4444" strokeWidth="1" strokeOpacity="0.3" />
        <text x={project3D({ x: 160, y: 0, z: 0 }).x} y={project3D({ x: 160, y: 0, z: 0 }).y} className="text-xs fill-red-300">X</text>

        <line x1={origin.x} y1={origin.y} x2={project3D({ x: 0, y: 150, z: 0 }).x} y2={project3D({ x: 0, y: 150, z: 0 }).y} stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
        <text x={project3D({ x: 0, y: 160, z: 0 }).x} y={project3D({ x: 0, y: 160, z: 0 }).y} className="text-xs fill-green-300">Y</text>

        <line x1={origin.x} y1={origin.y} x2={project3D({ x: 0, y: 0, z: 150 }).x} y2={project3D({ x: 0, y: 0, z: 150 }).y} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
        <text x={project3D({ x: 0, y: 0, z: 160 }).x} y={project3D({ x: 0, y: 0, z: 160 }).y} className="text-xs fill-blue-300">Z</text>


        {/* The Vector P' */}
        <line x1={origin.x} y1={origin.y} x2={p.x} y2={p.y} stroke="#6366f1" strokeWidth="3" />
        <circle cx={p.x} cy={p.y} r="6" fill="#6366f1" />
        <text x={p.x + 10} y={p.y} className="text-sm font-bold fill-indigo-600">P'</text>

        {/* Projection Lines to Planes to help visualize 3D position */}
        {/* Drop to XY Plane (z=0) */}
        {/*
                  <path 
                    d={`M ${p.x} ${p.y} L ${project3D({x:rotatedPoint3D.x, y:rotatedPoint3D.y, z:0}).x} ${project3D({x:rotatedPoint3D.x, y:rotatedPoint3D.y, z:0}).y}`} 
                    stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" 
                  />
                  */}
      </svg>
    );
  };

  const visualization = (
    <div className="bg-background rounded-lg shadow-sm border overflow-hidden relative w-full h-full">
      {mode === '2d' ? <Vis2D /> : <Vis3D />}
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
      title={lang === 'zh' ? "旋转矩阵与变换" : "Rotation Matrices & Transformations"}
      controls={Controls}
      visualization={visualization}
      documentation={documentation}
      lang={lang}
      setLang={setLang}
    />
  );
}
