import { useEffect, useState } from 'react';
import { Moon, Sun, Laptop, Github, Languages } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as Theme;
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
      <button
        onClick={() => setTheme('light')}
        className={`p-1 rounded-sm transition-colors ${theme === 'light' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="Light"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1 rounded-sm transition-colors ${theme === 'system' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="System"
      >
        <Laptop size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1 rounded-sm transition-colors ${theme === 'dark' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        title="Dark"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}

export function GithubLink() {
  const [stars, setStars] = useState<number | null>(null);
  const repoUrl = "https://github.com/FinParker/MathVis-Lab";
  const repoApi = "FinParker/MathVis-Lab";

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repoApi}`)
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) setStars(data.stargazers_count);
      })
      .catch(err => console.error("Failed to fetch stars", err));
  }, []);

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
    >
      <Github size={16} />
      <span className="hidden sm:inline">GitHub</span>
      {stars !== null && (
        <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
          {(stars / 1000).toFixed(1)}k
        </span>
      )}
    </a>
  );
}

export function LanguageToggle({ lang, setLang }: { lang: 'en' | 'zh', setLang: (l: 'en' | 'zh') => void }) {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
      title="Switch Language"
    >
      <Languages size={16} />
      <span className="hidden sm:inline">{lang === 'en' ? 'EN' : '中文'}</span>
    </button>
  );
}
