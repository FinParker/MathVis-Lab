import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';

// Mock imports for template - replace these in your actual project
// import docsEn from './docs.md?raw';
// import docsZh from './docs_zh.md?raw';
const docsEn = "# English Documentation\n\nYour markdown content here.";
const docsZh = "# 中文文档\n\n在此处编写 Markdown 内容。";

interface ProjectTemplateProps {
  // Add any props if needed, though usually projects are pages
}

export default function ProjectTemplate({ }: ProjectTemplateProps) {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');

  // State for controls
  const [param1, setParam1] = useState(10);
  const [param2, setParam2] = useState(true);

  // --- Controls Component ---
  const controls = (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Parameter 1</label>
        <input
          type="range"
          min="0" max="100"
          value={param1}
          onChange={(e) => setParam1(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground">Value: {param1}</div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="param2"
          checked={param2}
          onChange={(e) => setParam2(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="param2" className="text-sm font-medium">
          Enable Feature X
        </label>
      </div>

      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm font-medium transition-colors"
        onClick={() => console.log('Action triggered')}
      >
        Trigger Action
      </button>
    </div>
  );

  // --- Visualization Component ---
  const visualization = (
    <div className="h-full w-full flex items-center justify-center bg-white rounded-lg border shadow-sm p-4 relative">
      {/* Replace with your Canvas, SVG, or Interactive Graph */}
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">Visualization Area</h3>
        <p>Param 1: {param1}</p>
        <p>Param 2: {param2 ? 'On' : 'Off'}</p>
        <div className="mt-4 p-8 border border-dashed rounded bg-gray-50">
          [ Your D3 / Three.js / Canvas Content Here ]
        </div>
      </div>
    </div>
  );

  // --- Documentation Component ---
  const documentation = (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {lang === 'zh' ? docsZh : docsEn}
      </ReactMarkdown>
    </div>
  );

  return (
    <ProjectLayout
      title={lang === 'zh' ? "项目标题" : "Project Title"}
      lang={lang}
      setLang={setLang}
      controls={controls}
      visualization={visualization}
      documentation={documentation}
    />
  );
}
