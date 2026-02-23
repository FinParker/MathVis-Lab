import { Suspense, useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { projectRegistry } from '@/projects/registry';
import { ProjectSearch } from '@/components/ui/ProjectSearch';
import { GithubLink, ThemeToggle, LanguageToggle } from './components/ui/HeaderControls';

// 翻译字典
const TRANSLATIONS = {
  zh: {
    heroTitle: "交互式数学可视化",
    heroDesc: "探索数学之美，通过现代 web 技术将抽象概念转化为直观的动态演示。",
    noResults: "未找到匹配的项目",
    clearResults: "清除搜索",
    searchPlaceholder: "搜索项目...",
    backToHome: "返回首页",
    notFound: "未找到该可视化项目",
    loading: "加载可视化..."
  },
  en: {
    heroTitle: "Interactive Math Visualization",
    heroDesc: "Explore the beauty of mathematics, turning abstract concepts into intuitive dynamic demonstrations via modern web tech.",
    noResults: "No projects found matching",
    clearResults: "Clear search",
    searchPlaceholder: "Search projects...",
    backToHome: "Back to Home",
    notFound: "Visualization not found",
    loading: "Loading visualization..."
  }
};

// 简单的 Hook 管理语言偏好 (与 ProjectLayout 类似，但这里我们尝试简单复用 localStorage)
function useLanguagePreference() {
  const [lang, setLang] = useState<'zh' | 'en'>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) {
      return localStorage.getItem('lang') as 'zh' | 'en';
    }
    return 'zh'; // 默认中文
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return [lang, setLang] as const;
}

// 首页组件：展示项目列表
function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useLanguagePreference();
  const t = TRANSLATIONS[lang];

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return projectRegistry.filter(project => {
      // 同时搜索中英文内容
      const title = project.title.toLowerCase();
      const titleEn = (project.title_en || '').toLowerCase();
      const desc = project.description.toLowerCase();
      const descEn = (project.description_en || '').toLowerCase();

      return title.includes(query) ||
        titleEn.includes(query) ||
        desc.includes(query) ||
        descEn.includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-10 w-full">
        <h1 className="text-2xl font-bold tracking-tight whitespace-nowrap">MathViz Lab</h1>
        <div className="w-full max-w-md ml-4 hidden md:block">
          <ProjectSearch onSearch={setSearchQuery} />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <LanguageToggle lang={lang} setLang={setLang} />
          <ThemeToggle />
          <GithubLink />
        </div>
      </header>

      <main className="container mx-auto py-12 px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">{t.heroTitle}</h2>
          <p className="text-lg text-muted-foreground">
            {t.heroDesc}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">{t.noResults} "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary hover:underline"
            >
              {t.clearResults}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Link to={`/projects/${project.id}`} key={project.id} className="group block h-full">
                <div className="border rounded-lg overflow-hidden h-full hover:shadow-lg transition-shadow bg-card">
                  <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-4xl">🎲</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {lang === 'en' && project.title_en ? project.title_en : project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {lang === 'en' && project.description_en ? project.description_en : project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// 动态项目加载器
function ProjectLoader() {
  const { id } = useParams<{ id: string }>();
  const project = projectRegistry.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">未找到该可视化项目</p>
        <Link to="/" className="text-primary hover:underline">返回首页</Link>
      </div>
    );
  }

  const Component = project.component;

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading visualization...</div>}>
      <Component />
    </Suspense>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectLoader />} />
      </Routes>
    </Router>
  );
}

export default App;
