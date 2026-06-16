'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from './types';

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

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
        }

        .header {
          border-bottom: 1px solid #2a2a2a;
          position: sticky;
          top: 0;
          background: #0a0a0a;
          z-index: 10;
        }

        .header__inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-family: Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.2em;
          color: #f5f5f5;
        }

        .header__right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .user {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
        }

        .logout {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f5f5f5;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .logout:hover {
          border-bottom-color: #f5f5f5;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}