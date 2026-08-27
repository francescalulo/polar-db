// Whether the user has requested reduced motion at the OS/browser level.
// Call this at the point an animation would start (not once at module
// load) so it reflects live changes to the setting.
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
