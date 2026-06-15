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
            {onRoleChange && (
              <select
                className={styles.roleSwitcher}
                value={user.role}
                onChange={(e) => onRoleChange(e.target.value as Role)}
                aria-label="Preview as role (demo only)"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    View as {r}
                  </option>
                ))}
              </select>
            )}

            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={`${styles.badge} ${ROLE_BADGE_CLASS[user.role]}`}>
                {user.role}
              </span>
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