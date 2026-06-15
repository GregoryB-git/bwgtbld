'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/auth.module.css';

const ROLES = ['Director', 'Producer', 'Freelancer', 'Client'] as const;
type Role = (typeof ROLES)[number];

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role.');
      return;
    }
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password, role, name || undefined);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Tell us a bit about yourself to get started</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full Name (Optional)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>I am a...</span>
            <div className={styles.roleGrid}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.roleOption} ${
                    role === r ? styles.roleOptionActive : ''
                  }`}
                  onClick={() => setRole(r)}
                  aria-pressed={role === r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={styles.input}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}