import { reactive } from 'vue';
import { defaultCurriculum } from '../data/defaultCurriculum.js';
import { fetchRutas } from '../services/cmsApi.js';

export const curriculumState = reactive({
  rutas: defaultCurriculum,
  source: 'pwa-bundled',
  updatedAt: null,
  loading: false,
  initialized: false,
});

export async function loadCurriculum({ force = false } = {}) {
  if (curriculumState.loading) return;
  if (curriculumState.initialized && !force) return;

  curriculumState.loading = true;
  try {
    const result = await fetchRutas();
    curriculumState.rutas = result.rutas;
    curriculumState.source = result.source;
    curriculumState.updatedAt = result.updatedAt;
    curriculumState.initialized = true;
  } finally {
    curriculumState.loading = false;
  }
}

export function getSourceLabel(source) {
  switch (source) {
    case 'wordpress-headless':
      return 'Conectado · Headless WordPress API';
    case 'offline-cache':
      return 'Modo offline · Caché local';
    case 'pwa-bundled-wp-empty':
      return 'Contenido base PWA (CMS sin rutas aún)';
    default:
      return 'Modo autónomo · Contenido integrado PWA';
  }
}
