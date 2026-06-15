import styles from '../styles/dashboard.module.css';
import { User } from './types';

interface DashboardProps {
  user: User;
}

const projects = [
  {
    name: 'Midnight Run — Feature Film',
    status: 'In Production',
    statusType: 'active',
    nextMilestone: 'Scene 14 shoot — Jun 18',
  },
  {
    name: 'City Lights — Commercial',
    status: 'Pre-Production',
    statusType: 'pending',
    nextMilestone: 'Location scout — Jun 20',
  },
  {
    name: 'Echoes — Documentary',
    status: 'In Review',
    statusType: 'review',
    nextMilestone: 'Director cut due — Jun 25',
  },
];

const schedule = [
  { time: '09:00', title: 'Crew briefing — Stage 3', location: 'Studio A' },
  { time: '11:30', title: 'Rehearsal — Lead actors', location: 'Stage 3' },
  { time: '14:00', title: 'Review dailies with editor', location: 'Edit Bay 2' },
  { time: '16:30', title: 'Production meeting', location: 'Conference Room' },
];

const notes = [
  { project: 'Midnight Run', note: 'Revise dialogue for Scene 22 — pacing feels slow', date: 'Jun 13' },
  { project: 'Echoes', note: 'Add archival footage transition in Act 2', date: 'Jun 12' },
  { project: 'City Lights', note: 'Confirm storyboard approval with client', date: 'Jun 11' },
];

export default function DirectorDashboard({ user }: DashboardProps) {
  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className={styles.welcomeSubtitle}>
          Here&apos;s what&apos;s happening across your projects today.
        </p>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Active Projects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>2</span>
          <span className={styles.statLabel}>Scripts in Review</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>4</span>
          <span className={styles.statLabel}>Upcoming Shoots</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>5</span>
          <span className={styles.statLabel}>Pending Approvals</span>
        </div>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Projects</h2>
          <ul className={styles.list}>
            {projects.map((project) => (
              <li key={project.name} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{project.name}</span>
                  <span className={styles.listItemMeta}>{project.nextMilestone}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${project.statusType}`]}`}>
                  {project.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
          <ul className={styles.list}>
            {schedule.map((item) => (
              <li key={item.time} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemTitle}>{item.title}</span>
                  <span className={styles.listItemMeta}>{item.location}</span>
                </div>
                <span className={styles.listItemTime}>{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Script Notes</h2>
        <ul className={styles.list}>
          {notes.map((note, idx) => (
            <li key={idx} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <span className={styles.listItemTitle}>{note.note}</span>
                <span className={styles.listItemMeta}>{note.project}</span>
              </div>
              <span className={styles.listItemTime}>{note.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}