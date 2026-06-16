'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from './types';
import '../styles/lamp.css';

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
    </div>
  );
}