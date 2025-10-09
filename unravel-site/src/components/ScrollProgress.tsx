import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const scrollTop = mainElement.scrollTop;
      const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Interpolate color from green to blue based on scroll progress
  const getColor = () => {
    const green = { r: 108, g: 179, b: 63 }; // --color-secondary-500
    const blue = { r: 14, g: 159, b: 188 }; // --color-primary-500
    
    const factor = scrollProgress / 100;
    const r = Math.round(green.r + (blue.r - green.r) * factor);
    const g = Math.round(green.g + (blue.g - green.g) * factor);
    const b = Math.round(green.b + (blue.b - blue.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const trackElement = e.currentTarget;
    const rect = trackElement.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const clickProgress = (clickY / trackHeight) * 100;
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight;
      const targetScroll = (clickProgress / 100) * scrollHeight;
      mainElement.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const containerStyle: CSSProperties = {
    position: 'fixed',
    right: '2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    pointerEvents: 'all'
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: '4px',
    height: '300px',
    background: 'linear-gradient(180deg, rgba(108, 179, 63, 0.2) 0%, rgba(14, 159, 188, 0.2) 100%)',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'width 0.2s ease'
  };

  const ballStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: `${scrollProgress}%`,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '2px solid white',
    backgroundColor: getColor(),
    boxShadow: `0 0 20px ${getColor()}40`
  };

  return (
    <>
      <div className="scroll-progress-container" style={containerStyle}>
        <div 
          className="scroll-track" 
          style={trackStyle}
          onClick={handleTrackClick}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        >
          <div 
            className="scroll-ball"
            style={ballStyle}
          />
        </div>
      </div>
      
      <style>{`
        @media (hover: hover) {
          .scroll-track:hover {
            width: 6px !important;
          }
          
          .scroll-ball:hover {
            transform: translate(-50%, -50%) scale(1.2) !important;
          }
        }

        /* Hide on mobile and tablets */
        @media (max-width: 1024px) {
          .scroll-progress-container {
            display: none !important;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .scroll-ball,
          .scroll-track {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
