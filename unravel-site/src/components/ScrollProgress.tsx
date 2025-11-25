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
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'width 0.2s ease',
    overflow: 'hidden'
  };

  const progressStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: `${scrollProgress}%`,
    background: 'var(--unravel-green)',
    borderRadius: '2px',
    transition: 'height 0.1s ease-out'
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
          <div style={progressStyle} />
        </div>
      </div>
      
      <style>{`
        @media (hover: hover) {
          .scroll-track:hover {
            width: 6px !important;
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
          .scroll-track {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
