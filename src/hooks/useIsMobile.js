import { useEffect, useState } from 'react';

// Tracks whether the viewport is narrower than `breakpoint` (px), updating
// live as the window resizes. Called with different breakpoints at
// different call sites (e.g. 768 for "is mobile", 1024 for "is below
// desktop") rather than being tied to one fixed layout breakpoint.
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
