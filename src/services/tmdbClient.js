const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Shared fetch helper for all TMDB calls, so everyone hits the same base
// URL/key/error-handling instead of writing it separately per component.
export async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}): ${endpoint}`);
  }

  return response.json();
}

export function getPosterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function getBackdropUrl(path, size = 'w1280') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}
