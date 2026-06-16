'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/auth.module.css';
import radioStyles from './Windows7Radio.module.css';

import { useEffect } from 'react';
import { crtHum } from '../../utils/crtHum';
import { useProximityEffect } from '../../hooks/useProximityEffect';
import { ProximityDebug } from '../../components/ProximityDebug';
import CRTOverlay from '../../components/CRTOverlay';


const ROLES = ['Director', 'Producer', 'Freelancer', 'Client'] as const;
type Role = (typeof ROLES)[number];

export default function SignupPage() {
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
      new Audio('./Logon.wav').play();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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

      <div className={`${styles.card}`}>

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
            >
              <Image src="/forward.png" alt="Forward" width={40} height={40} />
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

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