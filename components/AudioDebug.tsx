// components/AudioDebug.tsx
'use client';

import { useState, useEffect } from 'react';
import { crtHum } from '../utils/crtHum';

export const AudioDebug = () => {
  const [audioState, setAudioState] = useState<string>('not started');
  const [volume, setVolume] = useState<number>(0.05);
  const [frequency, setFrequency] = useState<number>(60);

  useEffect(() => {
    // Monitor audio context state
    const interval = setInterval(() => {
      if ((crtHum as any).audioContext) {
        setAudioState((crtHum as any).audioContext.state);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  const testAudio = () => {
    console.log('🧪 Testing audio...');
    crtHum.start();
    
    // Test with different frequencies
    setTimeout(() => {
      if ((crtHum as any).oscillator) {
        (crtHum as any).oscillator.frequency.value = 100;
        console.log('Testing 100Hz');
      }
    }, 1000);
    
    setTimeout(() => {
      if ((crtHum as any).oscillator) {
        (crtHum as any).oscillator.frequency.value = 60;
        console.log('Testing 60Hz');
      }
    }, 2000);
  };

  const manualSetVolume = () => {
    //crtHum.setVolume(volume);
    console.log(`Manual volume set to ${volume}`);
  };

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'black', color: 'white', padding: 10, zIndex: 9999, fontSize: 12 }}>
      <div>🎵 Audio State: {audioState}</div>
      <div>🔊 Volume: {volume}</div>
      <button onClick={testAudio}>Test Audio</button>
      <button onClick={manualSetVolume}>Set Volume</button>
      <input 
        type="range" 
        min="0" 
        max="0.5" 
        step="0.01" 
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <input 
        type="range" 
        min="20" 
        max="1000" 
        step="10" 
        value={frequency}
        onChange={(e) => {
          const f = parseInt(e.target.value);
          setFrequency(f);
          if ((crtHum as any).oscillator) {
            (crtHum as any).oscillator.frequency.value = f;
          }
        }}
      />
      <div>🎵 Freq: {frequency}Hz</div>
    </div>
  );
};