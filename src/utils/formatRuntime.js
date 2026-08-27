// Formats a raw runtime in minutes (as returned by TMDB) into a compact
// "Xh Ym" string, e.g. 128 -> "2h 8m". Movies under an hour just show
// minutes (45 -> "45m"), and a missing/zero runtime returns an empty
// string so callers can conditionally hide it.
export function formatRuntime(minutes) {
  if (!minutes) return '';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;

  return `${hours}h ${remainingMinutes}m`;
}
