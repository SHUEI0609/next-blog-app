"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  // マウントされたかどうかのフラグ（ハイドレーションエラー防止のため）
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // サーバーサイドレンダリング時のチラつき防止のため、マウントされるまでは何もレンダリングしないか、
  // あるいは初期状態（light）でレンダリングするが、ここではThemeProviderとして機能させる。
  // ただし、themeの値がクライアントとサーバーで異なるとハイドレーションエラーになる可能性があるため、
  // mountedフラグを使って制御するのが一般的だが、今回はシンプルにchildrenを返す。
  // data-theme属性の設定はuseEffectで行われるため、初回の描画が一瞬ちらつく可能性があるが、
  // Next.jsのapp dirでの完全な解決はscriptタグの注入などが必要で複雑になるため、
  // ここではuseEffectベースのシンプルな実装とする。

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
