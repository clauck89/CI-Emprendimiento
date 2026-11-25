import { reactive, watch } from 'vue';

const STORAGE_KEY = 'veredacode_progress_v1';

function loadProgress() {
  try {
    if (typeof localStorage === 'undefined') return { completed: [] };
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Array.isArray(saved.completed)) {
      return { completed: [...new Set(saved.completed)] };
    }
  } catch {
    // Fallback limpio
  }
  return { completed: [] };
}

export const progressState = reactive(loadProgress());

watch(
  () => progressState.completed,
  (val) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: val }));
      }
    } catch {
      // Ignorar
    }
  },
  { deep: true }
);

export function moduleKey(rutaSlug, moduloSlug) {
  return `${rutaSlug}/${moduloSlug}`;
}

export function isModuleCompleted(rutaSlug, moduloSlug) {
  return progressState.completed.includes(moduleKey(rutaSlug, moduloSlug));
}

export function toggleModuleCompleted(rutaSlug, moduloSlug) {
  const key = moduleKey(rutaSlug, moduloSlug);
  const idx = progressState.completed.indexOf(key);
  if (idx === -1) {
    progressState.completed.push(key);
    return true;
  }
  progressState.completed.splice(idx, 1);
  return false;
}

export function getRutaProgress(ruta) {
  const total = ruta?.modulos?.length || 0;
  if (total === 0) return { completed: 0, total: 0, percent: 0 };
  const completed = ruta.modulos.filter((m) => isModuleCompleted(ruta.slug, m.slug)).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function getGlobalProgress(rutas) {
  const allModules = rutas.flatMap((r) => (r.modulos || []).map((m) => ({ r: r.slug, m: m.slug })));
  const total = allModules.length;
  if (total === 0) return { completed: 0, total: 0, percent: 0 };
  const completed = allModules.filter(({ r, m }) => isModuleCompleted(r, m)).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function exportProgressJson() {
  return JSON.stringify(
    {
      plataforma: 'VeredaCode',
      version: 1,
      exportadoEn: new Date().toISOString(),
      completed: progressState.completed,
    },
    null,
    2
  );
}

export function importProgressJson(rawJson) {
  const parsed = JSON.parse(rawJson);
  if (!parsed || !Array.isArray(parsed.completed)) {
    throw new Error('Archivo de progreso no válido.');
  }
  const merged = new Set([...progressState.completed, ...parsed.completed.filter((k) => typeof k === 'string')]);
  progressState.completed = [...merged];
  return progressState.completed.length;
}
