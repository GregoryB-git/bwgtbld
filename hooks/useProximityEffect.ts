// hooks/useProximityEffect.ts
import { useEffect, useRef, useCallback } from 'react';
import { crtHum } from '../utils/crtHum';

export const useProximityEffect = () => {
  const interactiveElementsRef = useRef<Set<HTMLElement>>(new Set());
  const rafIdRef = useRef<number | null>(null);

  const calculateDistance = (element: HTMLElement, mouseX: number, mouseY: number) => {
    const rect = element.getBoundingClientRect();
    const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
    const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
    
    return Math.sqrt(
      Math.pow(mouseX - closestX, 2) + Math.pow(mouseY - closestY, 2)
    );
  };

  const updateProximity = useCallback((mouseX: number, mouseY: number) => {
    // First, record that mouse is moving (this resets inactivity timer)
    crtHum.recordActivity();
    
    if (interactiveElementsRef.current.size === 0) {
      crtHum.resetProximity();
      return;
    }
    
    let closestDistance = Infinity;
    
    interactiveElementsRef.current.forEach(element => {
      if (element && document.body.contains(element)) {
        const distance = calculateDistance(element, mouseX, mouseY);
        closestDistance = Math.min(closestDistance, distance);
      } else {
        interactiveElementsRef.current.delete(element);
      }
    });
    
    if (closestDistance < 300) {
      crtHum.setProximity(closestDistance, 300);
    } else {
      crtHum.resetProximity();
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafIdRef.current) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      updateProximity(e.clientX, e.clientY);
      rafIdRef.current = null;
    });
  }, [updateProximity]);

  const registerElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      interactiveElementsRef.current.add(element);
    }
  }, []);

  const unregisterElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      interactiveElementsRef.current.delete(element);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      crtHum.forceStop();
    };
  }, [handleMouseMove]);

  return { registerElement, unregisterElement };
};