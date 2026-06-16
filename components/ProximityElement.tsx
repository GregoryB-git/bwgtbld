// components/ProximityElement.tsx
import { useEffect, useRef } from 'react';
import { useProximityEffect } from '../hooks/useProximityEffect';

interface ProximityElementProps {
  children: React.ReactNode;
  className?: string;
}

export const ProximityElement: React.FC<ProximityElementProps> = ({ 
  children, 
  className 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { registerElement } = useProximityEffect();

  useEffect(() => {
    if (elementRef.current) {
      registerElement(elementRef.current);
    }
  }, [registerElement]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};