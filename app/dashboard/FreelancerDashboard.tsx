'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from './types';

interface DashboardProps {
  user: User;
}

export default function FreelancerDashboard({ user }: DashboardProps) {
  const [started, setStarted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const click = (ctx: AudioContext, time: number, dur = 0.015, vol = 0.3) => {
    const size = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(gain).connect(ctx.destination);
    src.start(time);
  };

  const handleStart = () => {
    setStarted(true);

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx: AudioContext = new AudioCtx();
    ctxRef.current = ctx;
    const now = ctx.currentTime;

    // sharp starter clicks matching the visual cuts
    [0.05, 0.15, 0.22, 0.32, 0.45, 0.55, 0.7, 0.85, 1.0, 1.15].forEach((t) => click(ctx, now + t));

    // ballast hum that settles but never fully disappears
    const hum = ctx.createOscillator();
    hum.type = 'sawtooth';
    hum.frequency.value = 120;
    const humGain = ctx.createGain();
    humGain.gain.value = 0;
    hum.connect(humGain).connect(ctx.destination);
    hum.start(now);

    humGain.gain.setValueAtTime(0, now);
    humGain.gain.linearRampToValueAtTime(0.06, now + 1.3);
    humGain.gain.linearRampToValueAtTime(0.01, now + 2.5);
    // permanent faint residual hum — loops as long as the component is mounted
  };

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  if (!started) {
    return (
      <div className="prompt" onClick={handleStart}>
        click here
        <style jsx>{`
          .prompt {
            flex: 1;
            min-height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #030303;
            color: #555;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            cursor: pointer;
            user-select: none;
          }
          .prompt:hover {
            color: #888;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="placeholder">
      <div className="content">
        <span className="placeholder__label">Freelancer Dashboard</span>
        <h1 className="placeholder__title">Under Construction</h1>
        <span className="placeholder__sub">{user.name} — back soon</span>
      </div>

      <style jsx>{`
        .placeholder {
          flex: 1;
          min-height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #030303;
        }

        .placeholder::before {
          content: '';
          position: absolute;
          top: -25%;
          left: 50%;
          width: 140%;
          height: 65%;
          transform: translateX(-50%);
          background: radial-gradient(
            ellipse at top,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0.03) 40%,
            transparent 70%
          );
          pointer-events: none;
          animation:
            tubeStartup 1.3s steps(1, end) 0s 1 forwards,
            tubeIdle 4.5s steps(1, end) 1.3s infinite;
        }

        .content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 4rem 2rem;
          animation:
            tubeStartup 1.3s steps(1, end) 0s 1 forwards,
            tubeIdle 4.5s steps(1, end) 1.3s infinite;
        }

        .placeholder__label {
          display: block;
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 1.5rem;
        }

        .placeholder__title {
          font-family: Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: clamp(2.5rem, 8vw, 6rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin: 0;
          line-height: 1;
          color: #f5f5f5;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
        }

        .placeholder__sub {
          display: block;
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin-top: 1.5rem;
        }

        @keyframes tubeStartup {
          0% { opacity: 0; }
          4% { opacity: 1; }
          6% { opacity: 0; }
          9% { opacity: 1; }
          11% { opacity: 0.08; }
          15% { opacity: 1; }
          18% { opacity: 0; }
          24% { opacity: 1; }
          27% { opacity: 0.15; }
          33% { opacity: 1; }
          36% { opacity: 0; }
          45% { opacity: 1; }
          48% { opacity: 0.3; }
          60% { opacity: 1; }
          63% { opacity: 0.55; }
          100% { opacity: 1; }
        }

        @keyframes tubeIdle {
          0%, 100% { opacity: 1; }
          3% { opacity: 0.88; }
          5% { opacity: 1; }
          34% { opacity: 1; }
          36% { opacity: 0.92; }
          38% { opacity: 1; }
          61% { opacity: 1; }
          63% { opacity: 0.85; }
          66% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}