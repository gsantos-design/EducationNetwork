import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

type ConfettiCelebrationProps = {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
  particleCount?: number;
  spread?: number;
  originX?: number;
  originY?: number;
  colors?: string[];
};

export function ConfettiCelebration({
  isActive,
  onComplete,
  duration = 3000,
  particleCount = 150,
  spread = 70,
  originX = 0.5,
  originY = 0.5,
  colors,
}: ConfettiCelebrationProps) {
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Initialize confetti instance
  useEffect(() => {
    if (!confettiRef.current) return;
    
    const canvas = confettiRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas to be fullscreen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Set initial size
    resize();
    
    // Update canvas on window resize
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  // Trigger confetti when isActive changes to true
  useEffect(() => {
    if (isActive && !isAnimating && confettiRef.current) {
      setIsAnimating(true);
      
      const myConfetti = confetti.create(confettiRef.current, {
        resize: true,
        useWorker: false,
      });
      
      const end = Date.now() + duration;
      
      const confettiColors = colors || ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'];
      
      // Run multiple bursts in sequence
      (function frame() {
        myConfetti({
          particleCount: particleCount / 3,
          angle: 60,
          spread,
          origin: { x: originX, y: originY },
          colors: confettiColors,
          ticks: 100,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 35,
          shapes: ['square', 'circle'],
          scalar: 1.5,
        });
        
        myConfetti({
          particleCount: particleCount / 3,
          angle: 120,
          spread,
          origin: { x: originX, y: originY },
          colors: confettiColors,
          ticks: 100,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 35,
          shapes: ['square', 'circle'],
          scalar: 1.5,
        });
        
        myConfetti({
          particleCount: particleCount / 3,
          angle: 90,
          spread: spread / 1.5,
          origin: { x: originX, y: originY },
          colors: confettiColors,
          ticks: 100,
          gravity: 1,
          decay: 0.94,
          startVelocity: 45,
          shapes: ['star'],
          scalar: 1.8,
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          // Animation complete
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      }());
    }
  }, [isActive, isAnimating, duration, particleCount, spread, originX, originY, colors, onComplete]);
  
  return (
    <canvas
      ref={confettiRef}
      className={`fixed inset-0 z-50 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        transition: 'opacity 0.3s ease',
        display: isActive || isAnimating ? 'block' : 'none'
      }}
    />
  );
}

// Expose a more direct way to trigger confetti
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);
  
  const triggerConfetti = (options?: Omit<ConfettiCelebrationProps, 'isActive'>) => {
    setIsActive(true);
    
    // Auto-reset after animation completes
    const handleComplete = () => {
      setIsActive(false);
      options?.onComplete?.();
    };
    
    const duration = options?.duration || 3000;
    setTimeout(handleComplete, duration);
  };
  
  return {
    isActive,
    triggerConfetti,
    ConfettiComponent: (props: Omit<ConfettiCelebrationProps, 'isActive'>) => (
      <ConfettiCelebration isActive={isActive} {...props} />
    ),
  };
}