import { useEffect, useRef, useState } from 'react';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollStart = -rect.top;
      const scrollEnd = rect.height - window.innerHeight;
      
      if (scrollStart < 0) {
        setScrollProgress(0);
      } else if (scrollStart > scrollEnd) {
        setScrollProgress(100);
      } else {
        const progress = (scrollStart / scrollEnd) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`horizontal-scroll-container ${className}`}>
      <div 
        className="horizontal-scroll-content"
        style={{ transform: `translateX(-${scrollProgress}%)` }}
      >
        {children}
      </div>
    </div>
  );
}
