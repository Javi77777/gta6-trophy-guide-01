// Progress store for the Leonida Platinum tracker: earned trophies live in
// localStorage under one key, so progress survives a reload and never leaves
// the browser unless the player exports it. Export writes a JSON file;
// import reads one back and keeps only names that exist in the trophy list.

export const STORAGE_KEY = 'leonida-platinum-progress-v1';
export const SPOILER_KEY = 'leonida-platinum-spoiler-v1';

// The demo set used only when the page is opened with ?demo=1 (for the
// entry's screenshots): 13 early, plausible trophies, so the tracker shows
// real progress without touching a player's own save.
export const DEMO_EARNED_IDS = [2, 3, 8, 15, 16, 19, 20, 21, 35, 42, 52, 53, 55];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((name) => typeof name === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

export function loadSpoilerOn() {
  const raw = localStorage.getItem(SPOILER_KEY);
  return raw === null ? true : raw === '1';
}

export function saveSpoilerOn(value) {
  localStorage.setItem(SPOILER_KEY, value ? '1' : '0');
}

// Turn an imported file's text into a Set of valid trophy names. Returns
// null when the file is not usable JSON with a list of names.
export function parseImportedProgress(text, validNames) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) return null;
  const valid = new Set(validNames);
  return new Set(names.filter((name) => typeof name === 'string' && valid.has(name)));
}

export function downloadProgress(earned) {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned] }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}
