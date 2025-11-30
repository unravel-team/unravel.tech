import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
}

export default function AnimatedSection({ 
  children, 
  className = '',
  animationType = 'fadeUp'
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when section is 50% visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
        }
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Define animation configurations based on type
  const getAnimationConfig = () => {
    switch (animationType) {
      case 'fadeUp':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
        };
      case 'fadeIn':
        return {
          opacity: isVisible ? 1 : 0,
        };
      case 'slideLeft':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0px)' : 'translateX(60px)',
        };
      case 'slideRight':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0px)' : 'translateX(-60px)',
        };
      case 'scale':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        };
      default:
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
        };
    }
  };

  const springProps = useSpring({
    ...getAnimationConfig(),
    config: {
      tension: 120,
      friction: 30,
      mass: 1,
    },
  });

  return (
    <animated.section
      ref={sectionRef}
      className={`animated-section ${className}`}
      style={springProps}
    >
      {children}
    </animated.section>
  );
}
