import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
// @ts-ignore
import docsEn from './docs.md?raw';
// @ts-ignore
import docsZh from './docs_zh.md?raw';
import 'katex/dist/katex.min.css';

export default function CayleyYoneda() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');

  const controls = (
    <div className="flex flex-col gap-4 text-sm text-muted-foreground p-4">
      <p>
        {lang === 'zh'
          ? '目前暂无交互控制。'
          : 'No interactive controls available yet.'}
      </p>
    </div>
  );

  const visualization = (
    <div className="p-4 bg-white rounded-lg shadow h-full flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-4">
        {lang === 'zh' ? '可视化即将推出' : 'Visualization Coming Soon'}
      </h2>
      <p className="text-gray-600 max-w-md">
        {lang === 'zh'
          ? '此模块将展示左平移作用的可视化以及米田嵌入的概念图解。请阅读右侧文档。'
          : 'This module will demonstrate the visualization of Left Regular Representation and conceptual diagrams of the Yoneda Embedding. Please refer to the documentation.'}
      </p>
    </div>
  );

  const documentation = (
    <div className="prose prose-slate dark:prose-invert max-w-none p-4">
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
      title={lang === 'zh' ? "凯莱定理与米田引理" : "Cayley's Theorem & Yoneda Lemma"}
      lang={lang}
      setLang={setLang}
      controls={controls}
      visualization={visualization}
      documentation={documentation}
    />
  );
}
