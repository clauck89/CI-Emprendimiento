import { reactive, watch } from 'vue';

const STORAGE_KEY = 'veredacode_a11y_prefs_v1';

function loadPrefs() {
  const defaults = {
    fontScale: 100, // 90 | 100 | 115 | 130
    highContrast: false,
    reducedMotion: false,
    lowDataMode: false,
  };

  try {
    if (typeof localStorage === 'undefined') return defaults;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      return { ...defaults, ...saved };
    }
  } catch {
    // Usar valores por defecto
  }

  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    defaults.reducedMotion = true;
  }

  return defaults;
}

export const preferences = reactive(loadPrefs());

export function applyPreferencesToDom() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-scale', `${preferences.fontScale}%`);
  root.dataset.contrast = preferences.highContrast ? 'high' : 'standard';
  root.dataset.motion = preferences.reducedMotion ? 'reduced' : 'normal';
  root.dataset.lowData = preferences.lowDataMode ? 'on' : 'off';
}

watch(
  preferences,
  (val) => {
    applyPreferencesToDom();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
      }
    } catch {
      // Ignorar si el almacenamiento está restringido
    }
  },
  { deep: true, immediate: true }
);

export function adjustFontScale(delta) {
  const steps = [90, 100, 115, 130];
  const currentIdx = steps.indexOf(preferences.fontScale);
  const idx = currentIdx === -1 ? 1 : currentIdx;
  const nextIdx = Math.max(0, Math.min(steps.length - 1, idx + delta));
  preferences.fontScale = steps[nextIdx];
}

export function resetPreferences() {
  preferences.fontScale = 100;
  preferences.highContrast = false;
  preferences.reducedMotion = false;
  preferences.lowDataMode = false;
}
