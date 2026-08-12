// Formats a TMDB vote_average (0–10) into the app's percentage rating
// display. TMDB returns exactly 0 for movies with no votes yet (rather
// than omitting the field), so 0 is treated as "not yet rated" instead
// of a real 0% score.
export function formatRating(voteAverage) {
  if (!voteAverage) return 'N/A';
  return Math.round(voteAverage * 10) + '%';
}
