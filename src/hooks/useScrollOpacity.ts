import { useState, useEffect, type RefObject } from 'react';

export function useScrollOpacity(scrollRef: RefObject<HTMLElement | null>): number {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const newOpacity = Math.min(scrollTop / 100, 1);
      setOpacity(newOpacity);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return opacity;
}
