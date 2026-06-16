// components/ActivityDebug.tsx
'use client';

import { useState, useEffect } from 'react';

export const ActivityDebug = () => {
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setLastMoveTime(now);
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      setIsInactive(false);
      
      // Reset inactivity timer
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsInactive(true);
      }, 2000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(inactivityTimer);
    };
  }, []);

  const timeSinceLastMove = Date.now() - lastMoveTime;
  const isInactiveNow = timeSinceLastMove > 2000;
  const fadeProgress = Math.min(1, Math.max(0, (timeSinceLastMove - 2000) / 3000));

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.85)',
      color: '#0f0',
      padding: '12px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '5px',
      border: `2px solid ${isInactiveNow ? '#f00' : '#0f0'}`
    }}>
      <div>🖱️ Mouse: {mouseX}, {mouseY}</div>
      <div>⏱️ Last move: {(timeSinceLastMove / 1000).toFixed(1)}s ago</div>
      <div>💤 Inactive: {isInactiveNow ? 'YES (fading)' : 'NO'}</div>
      <div>📊 Fade: {(fadeProgress * 100).toFixed(0)}%</div>
      <div style={{
        width: '200px',
        height: '4px',
        background: '#333',
        marginTop: '8px',
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