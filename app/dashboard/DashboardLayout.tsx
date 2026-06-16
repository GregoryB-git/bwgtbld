'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from './types';
import '../styles/dashboardLayout.css'

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      new Audio('./Logoff.wav').play();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header__inner">
          <span className="logo">BWGTBLD</span>

          <div className="header__right">
            <span className="user">Hello, {user.name}</span>
            <button className="logout" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

    </div>
  );
}