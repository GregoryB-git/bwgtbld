import styles from '../styles/dashboard.module.css';
import { User } from './types';

interface DashboardProps {
  user: User;
}

const assignments = [
  {
    project: 'Midnight Run — Feature Film',
    role: 'Director of Photography',
    status: 'Active',
    statusType: 'active',
    deadline: 'Ongoing through Jul 30',
  },
  {
    project: 'City Lights — Commercial',
    role: 'Camera Operator',
    status: 'Starting Soon',
    statusType: 'pending',
    deadline: 'Starts Jun 20',
  },
  {
    project: 'Wavelength — Music Video',
    role: 'Gaffer',
    status: 'Completed',
    statusType: 'completed',
    deadline: 'Wrapped Jun 5',
  },
];

const invoices = [
  { project: 'Midnight Run', amount: 6200, status: 'Paid', statusType: 'completed', date: 'Jun 1' },
  { project: 'Wavelength', amount: 1800, status: 'Pending', statusType: 'pending', date: 'Jun 8' },
  { project: 'City Lights', amount: 3200, status: 'Draft', statusType: 'review', date: 'Jun 14' },
];

const deadlines = [
  { task: 'Submit gear list for City Lights shoot', date: 'Jun 18' },
  { task: 'Final invoice for Wavelength', date: 'Jun 20' },
  { task: 'Availability confirmation for July', date: 'Jun 25' },
];

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export default function FreelancerDashboard({ user }: DashboardProps) {
  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className={styles.welcomeSubtitle}>Here&apos;s a look at your current gigs and earnings.</p>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>2</span>
          <span className={styles.statLabel}>Active Gigs</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(5000)}</span>
          <span className={styles.statLabel}>Pending Invoices</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>38</span>
          <span className={styles.statLabel}>Hours Logged This Week</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Upcoming Deadlines</span>
        </div>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Assignments</h2>
          <ul className={styles.list}>
            {assignments.map((item) => (
              <li key={item.project + item.role} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{item.project}</span>
                  <span className={styles.listItemMeta}>
                    {item.role} · {item.deadline}
                  </span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${item.statusType}`]}`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Invoices</h2>
          <ul className={styles.list}>
            {invoices.map((invoice, idx) => (
              <li key={idx} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{invoice.project}</span>
                  <span className={styles.listItemMeta}>
                    {formatCurrency(invoice.amount)} · {invoice.date}
                  </span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${invoice.statusType}`]}`}>
                  {invoice.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>
        <ul className={styles.list}>
          {deadlines.map((item, idx) => (
            <li key={idx} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <span className={styles.listItemTitle}>{item.task}</span>
              </div>
              <span className={styles.listItemTime}>{item.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}