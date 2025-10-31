'use client';

import { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onThemeToggle: () => void;
  isDark: boolean;
}

export default function Header({ onSearch, onThemeToggle, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-gradient-to-br from-primary to-secondary text-white z-50 shadow-lg">
      <div className="h-full flex items-center justify-between px-5">
        <h1 className="text-xl font-bold">EECS 16A 复习站</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索知识点或示例题..."
            className="px-3.5 py-2 rounded-full bg-white/20 text-white placeholder-white/70
                     w-56 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
          />

          <button
            onClick={onThemeToggle}
            className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30
                     transition-colors cursor-pointer"
          >
            {isDark ? '浅色模式' : '深色模式'}
          </button>
        </div>
      </div>
    </header>
  );
}
