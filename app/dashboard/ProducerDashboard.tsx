import styles from '../styles/dashboard.module.css';
import { User } from './types';

interface DashboardProps {
  user: User;
}

const budgets = [
  { name: 'Midnight Run — Feature Film', total: 480000, spent: 312000 },
  { name: 'City Lights — Commercial', total: 95000, spent: 41000 },
  { name: 'Echoes — Documentary', total: 150000, spent: 138500 },
];

const team = [
  { name: 'Jordan Lee', role: 'Director of Photography', project: 'Midnight Run' },
  { name: 'Sam Patel', role: 'Editor', project: 'Echoes' },
  { name: 'Riley Chen', role: 'Production Designer', project: 'City Lights' },
  { name: 'Morgan Diaz', role: 'Sound Mixer', project: 'Midnight Run' },
];

const activity = [
  { text: 'Invoice approved for Riley Chen — $4,200', date: 'Jun 14' },
  { text: 'Budget revision submitted for Echoes', date: 'Jun 13' },
  { text: 'New vendor quote received — Lighting Co.', date: 'Jun 12' },
  { text: 'Contract signed with Jordan Lee', date: 'Jun 10' },
];

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export default function ProducerDashboard({ user }: DashboardProps) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className={styles.welcomeSubtitle}>
          Here&apos;s an overview of your project budgets and team.
        </p>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(totalBudget)}</span>
          <span className={styles.statLabel}>Total Budget</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(totalSpent)}</span>
          <span className={styles.statLabel}>Spent to Date</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{budgets.length}</span>
          <span className={styles.statLabel}>Active Projects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>7</span>
          <span className={styles.statLabel}>Pending Invoices</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Project Budgets</h2>
        <ul className={styles.list}>
          {budgets.map((budget) => {
            const percent = Math.min(100, Math.round((budget.spent / budget.total) * 100));
            const isNearLimit = percent >= 90;
            return (
              <li key={budget.name} className={styles.listItemColumn}>
                <div className={styles.budgetHeader}>
                  <span className={styles.listItemTitle}>{budget.name}</span>
                  <span className={styles.listItemMeta}>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.total)}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${isNearLimit ? styles.progressFillWarning : ''}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team Members</h2>
          <ul className={styles.list}>
            {team.map((member) => (
              <li key={member.name} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{member.name}</span>
                  <span className={styles.listItemMeta}>{member.role}</span>
                </div>
                <span className={styles.listItemMeta}>{member.project}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <ul className={styles.list}>
            {activity.map((item, idx) => (
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