import styles from '../styles/dashboard.module.css';
import { User } from './types';

interface DashboardProps {
  user: User;
}

const projects = [
  { name: 'City Lights — Commercial', status: 'In Pre-Production', statusType: 'pending', progress: 25 },
  { name: 'Brand Refresh — Promo Video', status: 'In Production', statusType: 'active', progress: 60 },
  { name: 'Annual Report Video', status: 'In Review', statusType: 'review', progress: 90 },
];

const approvals = [
  { item: 'Storyboard approval — City Lights', date: 'Due Jun 19' },
  { item: 'Budget revision sign-off — Brand Refresh', date: 'Due Jun 21' },
  { item: 'Final cut approval — Annual Report Video', date: 'Due Jun 24' },
];

const updates = [
  { text: 'New cut uploaded for Annual Report Video', date: 'Jun 14' },
  { text: 'Storyboards shared for City Lights', date: 'Jun 13' },
  { text: 'Production schedule updated for Brand Refresh', date: 'Jun 11' },
];

export default function ClientDashboard({ user }: DashboardProps) {
  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className={styles.welcomeSubtitle}>Here&apos;s the latest on your projects.</p>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Active Projects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>$725,000</span>
          <span className={styles.statLabel}>Total Investment</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Pending Approvals</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>5</span>
          <span className={styles.statLabel}>New Messages</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Projects</h2>
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.name} className={styles.listItemColumn}>
              <div className={styles.budgetHeader}>
                <span className={styles.listItemTitle}>{project.name}</span>
                <span className={`${styles.statusBadge} ${styles[`status_${project.statusType}`]}`}>
                  {project.status}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending Approvals</h2>
          <ul className={styles.list}>
            {approvals.map((item, idx) => (
              <li key={idx} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{item.item}</span>
                </div>
                <span className={styles.listItemTime}>{item.date}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Updates</h2>
          <ul className={styles.list}>
            {updates.map((item, idx) => (
              <li key={idx} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{item.text}</span>
                </div>
                <span className={styles.listItemTime}>{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}