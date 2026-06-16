// components/ProximityDebug.tsx
'use client';

import { useState, useEffect } from 'react';

export const ProximityDebug = () => {
  const [distance, setDistance] = useState(200);
  const [volume, setVolume] = useState(0);
  const [isInactive, setIsInactive] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateFromMouse = (e: MouseEvent) => {
      const now = Date.now();
      setLastMoveTime(now);
      setIsInactive(false);
      
      // Find closest interactive element
      const elements = document.querySelectorAll('input, button, [role="radio"], fieldset');
      let minDist = 300;
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right));
        const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
        const dist = Math.sqrt(Math.pow(e.clientX - closestX, 2) + Math.pow(e.clientY - closestY, 2));
        minDist = Math.min(minDist, dist);
      });
      
      setDistance(Math.round(minDist));
      
      // Calculate volume based on distance
      const rawProximity = 1 - Math.min(1, Math.max(0, minDist / 200));
      const exponentialProximity = Math.pow(rawProximity, 0.4);
      const maxVolume = 0.45;
      const baseVolume = 0.05;
      let vol = baseVolume + (exponentialProximity * (maxVolume - baseVolume));
      setVolume(vol);
      
      // Reset inactivity timer
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsInactive(true);
      }, 2000);
    };
    
    document.addEventListener('mousemove', updateFromMouse);
    
    return () => {
      document.removeEventListener('mousemove', updateFromMouse);
      clearTimeout(timeoutId);
    };
  }, []);

  const timeSinceLastMove = Date.now() - lastMoveTime;
  const isInactiveNow = timeSinceLastMove > 2000;
  const fadeProgress = Math.min(1, Math.max(0, (timeSinceLastMove - 2000) / 3000));

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      left: 10,
      background: 'rgba(0,0,0,0.85)',
      color: '#0f0',
      padding: '12px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '5px',
      border: `1px solid ${isInactiveNow ? '#f00' : '#0f0'}`
    }}>
      <div>📏 Distance: {distance}px</div>
      <div>🔊 Volume: {volume.toFixed(3)}</div>
      <div>⏱️ Inactive: {isInactiveNow ? 'YES' : 'NO'}</div>
      <div>📊 Fade: {(fadeProgress * 100).toFixed(0)}%</div>
      <div>🖱️ Last move: {(timeSinceLastMove / 1000).toFixed(1)}s ago</div>
      <div style={{
        width: '200px',
        height: '4px',
        background: '#333',
        marginTop: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(volume / 0.45) * 100}%`,
          height: '100%',
          background: isInactiveNow ? '#f00' : '#0f0',
          transition: 'width 0.05s linear'
        }} />
      </div>
      <div style={{
        width: '200px',
        height: '4px',
        background: '#333',
        marginTop: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${fadeProgress * 100}%`,
          height: '100%',
          background: '#ff0',
          transition: 'width 0.1s linear'
        }} />
      </div>
    </div>
  );
};