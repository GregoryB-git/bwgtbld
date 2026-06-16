'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './context/AuthContext';
import styles from './styles/auth.module.css';

import { useEffect } from 'react';
import { crtHum } from '../utils/crtHum';
import { useProximityEffect } from '../hooks/useProximityEffect';
import { InteractiveElement } from '../components/InteractiveElement';
import radioStyles from './Windows7Radio.module.css';
import CRTOverlay from '../components/CRTOverlay';



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const { registerElement } = useProximityEffect();
  
    useEffect(() => {
      // Register all interactive elements
      const elements = document.querySelectorAll('input, button, fieldset');
      elements.forEach(el => registerElement(el as HTMLElement));
      
      // Start hum
      const startHum = () => crtHum.start();
      document.addEventListener('click', startHum, { once: true });
      
      return () => crtHum.stop();
    }, [registerElement]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      new Audio('./Logon.wav').play();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForward = () => {
    // Add your forward functionality here
    console.log('Forward button clicked');
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
              onClick={handleForward}
              className={styles.forwardButton}
              aria-label="Forward"
            >
              <Image
                src="/forward.png"
                alt="Forward"
                width={40}
                height={40}
              />
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
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