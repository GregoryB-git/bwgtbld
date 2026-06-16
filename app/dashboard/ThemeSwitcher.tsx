'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/dashboard.module.css';

export default function ThemeSwitcher({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'saas' | 'bwgtbld'>('saas');

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-theme');
    if (saved === 'bwgtbld') setTheme('bwgtbld');
  }, []);

  function toggle(value: 'saas' | 'bwgtbld') {
    setTheme(value);
    localStorage.setItem('dashboard-theme', value);
  }

  return (
    <div className={theme === 'bwgtbld' ? styles.themeBwgtbld : styles.themeSaas}>
      <select
        className={styles.themeSelect}
        value={theme}
        onChange={(e) => toggle(e.target.value as 'saas' | 'bwgtbld')}
      >
        <option value="saas">B2B SaaS</option>
        <option value="bwgtbld">BWGTBLD</option>
      </select>
      {children}
    </div>
  );
}