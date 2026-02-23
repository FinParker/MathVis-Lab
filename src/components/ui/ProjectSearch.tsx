import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function ProjectSearch({ onSearch, className = '' }: ProjectSearchProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    onSearch(query);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search projects..."
          className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
      </div>
    </div>
  );
}
