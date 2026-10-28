import { useEffect } from 'react';

/**
 * Hook that locks body scroll while active (e.g. for modals/sidebars).
 * @param {boolean} locked - Whether to lock body scroll.
 */
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
