import { useEffect, useRef } from 'react';
import { analytics } from '../services/analytics';

export function useSectionTracking(sectionName: string, threshold: number = 0.5) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            analytics.track('section_view', sectionName, {
              visibility: entry.intersectionRatio,
            });
            hasTracked.current = true; // Only track once per session
          }
        });
      },
      { threshold }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [sectionName, threshold]);

  return sectionRef;
}

export function useInteractionTracking() {
  const trackInteraction = (name: string, metadata?: Record<string, any>) => {
    analytics.track('interaction', name, metadata);
  };

  return { trackInteraction };
}
