// components/InteractiveElement.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useProximityEffect } from '../hooks/useProximityEffect';

interface InteractiveElementProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InteractiveElement: React.FC<InteractiveElementProps> = ({ 
  children, 
  className,
  onClick 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useProximityEffect();

  useEffect(() => {
    if (elementRef.current) {
      registerElement(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        unregisterElement(elementRef.current);
      }
    };
  }, [registerElement, unregisterElement]);

  return (
    <div ref={elementRef} className={className} onClick={onClick}>
      {children}
    </div>
  );
};