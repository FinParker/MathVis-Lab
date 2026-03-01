import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import { LatticeDiagram } from './LatticeDiagram';
import { CodeExamples } from './CodeExamples';
// @ts-ignore
import docs from './docs.md?raw';

export default function LatticeProject() {
  const visualization = (
    <div className="w-full h-full overflow-y-auto p-4 space-y-8">
      <LatticeDiagram />
      <CodeExamples />
    </div>
  );

  const documentation = (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {docs}
      </ReactMarkdown>
    </div>
  );

  const controls = (
    <div className="text-sm text-slate-500">
      <p>Interact with the diagram nodes to highlight relations.</p>
    </div>
  );

  return (
    <ProjectLayout
      title="类型系统中的格 (Lattice in Type Systems)"
      controls={controls}
      visualization={visualization}
      documentation={documentation}
    />
  );
}
