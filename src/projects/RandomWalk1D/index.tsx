import { useState } from 'react';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import { useRandomWalk1DSimulation } from './Simulation';
import RWCanvas1D from './Canvas';
import RWCharts1D from './Charts';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import docs from './docs.md?raw';

export default function RandomWalk1DProject() {
  const [params, setParams] = useState({
    maxSteps: 100,
    sampleSize: 50,
    speed: 1,
  });

  const { paths, stats, isPlaying, actions } = useRandomWalk1DSimulation(params);

  // 控制面板
  const Controls = (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sample Size (N)</label>
        <input
          type="range" min="1" max="200" step="1"
          value={params.sampleSize}
          onChange={(e) => setParams(p => ({ ...p, sampleSize: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="text-xs text-right text-muted-foreground">{params.sampleSize} paths</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Max Steps</label>
        <input
          type="range" min="10" max="500" step="10"
          value={params.maxSteps}
          onChange={(e) => setParams(p => ({ ...p, maxSteps: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="text-xs text-right text-muted-foreground">{params.maxSteps} steps</div>
      </div>

      <div className="flex gap-2 pt-4">
        {!isPlaying ? (
          <button onClick={actions.start} className="flex-1 bg-primary text-primary-foreground h-9 px-4 py-2 rounded text-sm font-medium hover:bg-primary/90">
            Start
          </button>
        ) : (
          <button onClick={actions.pause} className="flex-1 bg-secondary text-secondary-foreground h-9 px-4 py-2 rounded text-sm font-medium hover:bg-secondary/80">
            Pause
          </button>
        )}
        <button onClick={actions.reset} className="flex-1 border border-input h-9 px-4 py-2 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          Reset
        </button>
      </div>

      <div className="p-4 bg-muted/50 rounded text-xs font-mono">
        <div>Status: {isPlaying ? 'Running' : 'Paused'}</div>
        <div>Current Step: {stats.length > 0 ? stats[stats.length - 1].step : 0}</div>
      </div>
    </div>
  );

  return (
    <ProjectLayout
      title="1D Random Walk"
      controls={Controls}
      visualization={
        <div className="flex flex-col h-full gap-4">
          {/* Canvas */}
          <div className="flex-grow bg-black rounded border border-border shadow-sm overflow-hidden relative">
            <RWCanvas1D paths={paths} maxSteps={params.maxSteps} />
          </div>

          {/* Chart */}
          <div className="h-48 bg-card rounded border border-border p-2">
            <div className="text-xs font-bold text-muted-foreground mb-2 px-2">Mean Squared Displacement (MSD)</div>
            <RWCharts1D stats={stats} />
          </div>
        </div>
      }
      documentation={
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {docs}
          </ReactMarkdown>
        </div>
      }
    />
  );
}
