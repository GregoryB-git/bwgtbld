'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/dashboard.module.css';
import { Role, User } from './types';

interface DashboardLayoutProps {
  user: User;
  onRoleChange?: (role: Role) => void;
  children: ReactNode;
}

const ROLE_BADGE_CLASS: Record<Role, string> = {
  Director: styles.badgeDirector,
  Producer: styles.badgeProducer,
  Freelancer: styles.badgeFreelancer,
  Client: styles.badgeClient,
};

const ROLES: Role[] = ['Director', 'Producer', 'Freelancer', 'Client'];

export default function DashboardLayout({ user, onRoleChange, children }: DashboardLayoutProps) {
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
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>BWGTBLD</div>

          <div className={styles.headerRight}>

              

            <div className={styles.userInfo}>
              <span className={styles.userName}>{"Hello, "}{user.name}</span>
            </div>

            <button 
              className={styles.logoutButton} 
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}