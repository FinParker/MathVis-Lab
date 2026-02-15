import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { projectRegistry } from '@/projects/registry';

// 首页组件：展示项目列表
function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight">MathViz Lab</h1>
      </header>

      <main className="container mx-auto py-12 px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">交互式数学可视化</h2>
          <p className="text-lg text-muted-foreground">
            探索数学之美，通过现代 web 技术将抽象概念转化为直观的动态演示。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectRegistry.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="group block h-full">
              <div className="border rounded-lg overflow-hidden h-full hover:shadow-lg transition-shadow bg-card">
                <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
                  {/* 实际项目中这里应该是 project.thumbnail */}
                  <span className="text-4xl">🎲</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectLoader />} />
      </Routes>
    </Router>
  );
}

export default App;
