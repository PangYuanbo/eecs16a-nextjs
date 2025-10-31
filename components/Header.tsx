'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';

interface HeaderProps {
  onSearch: (query: string) => void;
  onThemeToggle: () => void;
  isDark: boolean;
}

export default function Header({ onSearch, onThemeToggle, isDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-gradient-to-br from-primary to-secondary text-white z-50 shadow-lg">
      <div className="h-full flex items-center justify-between px-5">
        <h1 className="text-xl font-bold">{t('header.title')}</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('header.searchPlaceholder')}
            className="px-3.5 py-2 rounded-full bg-white/20 text-white placeholder-white/70
                     w-56 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
          />

          <div id="google_translate_element" className="google-translate-wrapper"></div>

          <button
            onClick={toggleLanguage}
            className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30
                     transition-colors cursor-pointer font-medium"
            title={language === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          <button
            onClick={onThemeToggle}
            className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30
                     transition-colors cursor-pointer"
          >
            {isDark ? t('header.lightMode') : t('header.darkMode')}
          </button>
        </div>
      </div>
    </header>
  );
}
