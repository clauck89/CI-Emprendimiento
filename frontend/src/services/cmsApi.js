import { defaultCurriculum } from '../data/defaultCurriculum.js';

const CACHE_KEY = 'veredacode_rutas_cache_v1';
const API_BASE = import.meta.env.VITE_WP_API_BASE || '/wp-json/veredacode/v1';

function readStorage(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignoramos errores de cuota en dispositivos con almacenamiento limitado
  }
}

/**
 * Obtiene las rutas educativas intentando primero el Headless WordPress REST API
 * con timeout corto (4s) para no bloquear conexiones rurales inestables.
 * Si WordPress no responde o aún no tiene rutas publicadas, utiliza caché local
 * o el currículo integrado en la PWA.
 */
export async function fetchRutas({ fetchImpl = globalThis.fetch, timeoutMs = 4000 } = {}) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    if (typeof fetchImpl !== 'function') {
      throw new Error('fetch unavailable');
    }

    const res = await fetchImpl(`${API_BASE}/rutas`, {
      headers: { Accept: 'application/json' },
      signal: controller?.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const payload = await res.json();
    if (payload && Array.isArray(payload.rutas) && payload.rutas.length > 0) {
      writeStorage(CACHE_KEY, {
        rutas: payload.rutas,
        updatedAt: payload.updatedAt || new Date().toISOString(),
      });
      return {
        rutas: payload.rutas,
        source: 'wordpress-headless',
        updatedAt: payload.updatedAt || new Date().toISOString(),
      };
    }

    // WordPress responde pero aún no se ha ejecutado el seed de contenidos
    return {
      rutas: defaultCurriculum,
      source: 'pwa-bundled-wp-empty',
      updatedAt: null,
    };
  } catch {
    const cached = readStorage(CACHE_KEY);
    if (cached && Array.isArray(cached.rutas) && cached.rutas.length > 0) {
      return {
        rutas: cached.rutas,
        source: 'offline-cache',
        updatedAt: cached.updatedAt,
      };
    }

    return {
      rutas: defaultCurriculum,
      source: 'pwa-bundled',
      updatedAt: null,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function checkCmsHealth({ fetchImpl = globalThis.fetch, timeoutMs = 3500 } = {}) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetchImpl(`${API_BASE}/health`, {
      headers: { Accept: 'application/json' },
      signal: controller?.signal,
    });
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const data = await res.json();
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err?.message || 'Sin conexión con WordPress API' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function findRutaBySlug(rutas, slug) {
  return rutas.find((r) => r.slug === slug) || null;
}

export function findModuloBySlug(ruta, moduloSlug) {
  if (!ruta || !Array.isArray(ruta.modulos)) return null;
  return ruta.modulos.find((m) => m.slug === moduloSlug) || null;
}
