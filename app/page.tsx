'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './context/AuthContext';
import styles from './styles/auth.module.css';
import { crtHum } from '../utils/crtHum';
import { useProximityEffect } from '../hooks/useProximityEffect';
import CRTOverlay from '../components/CRTOverlay';

type FieldError = {
  field: 'email' | 'password' | null;
  message: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<FieldError>({ field: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { registerElement } = useProximityEffect();

  useEffect(() => {
    // Register all interactive elements
    const elements = document.querySelectorAll('input, button, fieldset');
    elements.forEach((el) => registerElement(el as HTMLElement));

    // Start hum
    const startHum = () => crtHum.start();
    document.addEventListener('click', startHum, { once: true });

    return () => crtHum.stop();
  }, [registerElement]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ field: null, message: '' });

    if (!email) {
      new Audio('./Ding.wav').play();
      setError({ field: 'email', message: 'Please enter your email.' });
      return;
    }
    if (!password) {
      new Audio('./Ding.wav').play();
      setError({ field: 'password', message: 'Please enter your password.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      new Audio('./Logon.wav').play();
    } catch (err: any) {
      new Audio('./Ding.wav').play();
      setError({ field: 'password', message: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* Background image */}
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
          <div className={styles.avatarContainer}>
            <Image
              src="/flower.png"
              alt="Avatar"
              width={80}
              height={80}
              className={styles.avatarIcon}
            />
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
                placeholder="Your email"
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
                autoComplete="current-password"
                className={styles.passwordInput}
                placeholder="Password"
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
                <Image
                  src="/forward.png"
                  alt="Forward"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          </div>
        </form>

        <p className={styles.footer}>
          <Link href="/signup" className="button">
            <u>Sign up</u>
          </Link>
        </p>
      </div>
      <CRTOverlay />
    </main>
  );
}