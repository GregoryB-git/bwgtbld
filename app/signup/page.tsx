'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/auth.module.css';
import radioStyles from '../styles/Windows7Radio.module.css';

import { crtHum } from '../../utils/crtHum';
import { useProximityEffect } from '../../hooks/useProximityEffect';
import CRTOverlay from '../../components/CRTOverlay';

const ROLES = ['Director', 'Producer', 'Freelancer', 'Client'] as const;
type Role = (typeof ROLES)[number];

type FieldError = {
  field: 'role' | 'email' | 'password' | null;
  message: string;
};

export default function SignupPage() {
  const { registerElement } = useProximityEffect();

  useEffect(() => {
    const elements = document.querySelectorAll('input, button, fieldset');
    elements.forEach((el) => registerElement(el as HTMLElement));

    const startHum = () => crtHum.start();
    document.addEventListener('click', startHum, { once: true });

    return () => crtHum.stop();
  }, [registerElement]);

  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<FieldError>({ field: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ field: null, message: '' });

    if (!role) {
      new Audio('./Ding.wav').play();
      setError({ field: 'role', message: 'Please select a role.' });
      return;
    }
    if (!email) {
      new Audio('./Ding.wav').play();
      setError({ field: 'email', message: 'Please enter your email.' });
      return;
    }
    if (!password) {
      new Audio('./Ding.wav').play();
      setError({ field: 'password', message: 'Please enter a password.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password, role, name || undefined);
      new Audio('./Logon.wav').play();
    } catch (err: any) {
      new Audio('./Ding.wav').play();
      setError({ field: 'email', message: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <Image
          src="/background.png"
          alt="Background"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Your name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.fieldWrapper}>
            {error.field === 'role' && (
              <div className={styles.errorBox}>{error.message}</div>
            )}
            <fieldset className={radioStyles.radioGroup} style={{ margin: 0 }}>
              <div>Select you role</div>

              {ROLES.map((r, index) => (
                <div key={r}>
                  <input
                    id={`role-${index}`}
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <label htmlFor={`role-${index}`}> {r}</label>
                </div>
              ))}
            </fieldset>
          </div>

          <div className={styles.fieldWrapper}>
            {error.field === 'email' && (
              <div className={styles.errorBox}>{error.message}</div>
            )}
            <div className={styles.field}>
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
          </div>

          <div className={styles.fieldWrapper}>
            {error.field === 'password' && (
              <div className={styles.errorBox}>{error.message}</div>
            )}
            <div className={styles.passwordContainer}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={styles.passwordInput}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className={styles.forwardButton}
                aria-label="Forward"
                disabled={isSubmitting}
              >
                <Image src="/forward.png" alt="Forward" width={40} height={40} />
              </button>
            </div>
          </div>
        </form>

        <p className={styles.footer}>
          <Link href="/" className="button">
            <u>Login instead</u>
          </Link>
        </p>
      </div>
      <CRTOverlay />
    </main>
  );
}