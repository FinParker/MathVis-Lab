import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle, GithubLink, LanguageToggle } from '@/components/ui/HeaderControls';

interface ProjectLayoutProps {
  title: string;
  controls: ReactNode;
  visualization: ReactNode;
  documentation: ReactNode;
  footer?: ReactNode;
  lang?: 'en' | 'zh';
  setLang?: (l: 'en' | 'zh') => void;
}

export function ProjectLayout({ title, controls, visualization, documentation, lang, setLang }: ProjectLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* 顶部导航 */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0 z-10 w-full">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-lg mr-8 hover:text-primary transition-colors whitespace-nowrap">
            MathViz Lab
          </Link>
          <span className="text-muted-foreground mr-2 hidden sm:inline">/</span>
          <h1 className="font-semibold text-sm sm:text-base truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {lang && setLang && <LanguageToggle lang={lang} setLang={setLang} />}
          <ThemeToggle />
          <GithubLink />
        </div>
      </header>

      {/* 主体内容：三栏布局 (左控制，中可视，右文档) 或 两栏布局 (左控制+可视，右文档) */}
      {/* 这里采用：左侧固定宽度的控制面板 + 中间自适应的可视化 + 右侧可折叠的文档（或者文档放在下方） */}
      {/* 我们按用户需求：左侧控制，右侧可视。文档通常比较长，放在下方或者通过 Tabs 切换比较好。
          考虑到这通常是宽屏体验，我们可以设计成：
          左侧 (250px-300px)：控制参数
          中间 (flex-grow)：可视化画布 + 图表
          右侧 (300px-400px)：文档说明 (可折叠)
      */}
      <div className="flex flex-1 overflow-hidden">

        {/* 左侧控制栏 */}
        <aside className="w-80 border-r bg-card/50 p-4 overflow-y-auto shrink-0 flex flex-col gap-6">
          <div className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Controls</div>
          {controls}
        </aside>

        {/* 中间可视化区域 */}
        <main className="flex-1 bg-muted/20 p-4 overflow-hidden relative flex flex-col">
          {visualization}
        </main>

        {/* 右侧文档区域 */}
        <aside className="w-[400px] border-l bg-card overflow-y-auto p-6 shrink-0 prose prose-slate dark:prose-invert max-w-none">
          {documentation}
        </aside>
      </div>
    </div>
  );
}
