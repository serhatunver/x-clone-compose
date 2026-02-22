'use client';

import { useEffect, useRef, useState } from 'react';

export function useSmartHeader() {
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const scrollY = window.scrollY;

      const delta = scrollY - lastScrollY.current;
      const time = now - lastTimestamp.current;

      const velocity = time > 0 ? Math.abs(delta / time) : 0;

      let nextVisible = visible;

      if (scrollY < 100) {
        nextVisible = true;
      } else if (delta > 0) {
        nextVisible = false;
      } else if (velocity > 3) {
        nextVisible = true;
      }

      setVisible((prev) => (prev !== nextVisible ? nextVisible : prev));

      lastScrollY.current = scrollY;
      lastTimestamp.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  return visible;
}
