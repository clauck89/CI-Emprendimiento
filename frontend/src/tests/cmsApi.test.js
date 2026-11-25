import { describe, it, expect } from 'vitest';
import { fetchRutas, findRutaBySlug, findModuloBySlug } from '../services/cmsApi.js';
import { defaultCurriculum } from '../data/defaultCurriculum.js';

describe('Cliente API Headless WordPress con fallback offline', () => {
  it('consume rutas reales cuando WordPress REST API responde correctamente', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        source: 'wordpress-headless',
        rutas: [{ slug: 'ruta-cms', rutaNumero: 1, titulo: 'Desde WordPress', modulos: [] }],
        updatedAt: '2026-11-24T00:00:00Z',
      }),
    });

    const res = await fetchRutas({ fetchImpl: mockFetch });
    expect(res.source).toBe('wordpress-headless');
    expect(res.rutas).toHaveLength(1);
    expect(res.rutas[0].slug).toBe('ruta-cms');
  });

  it('usa el currículo integrado PWA si WordPress está activo pero aún sin rutas cargadas', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({ rutas: [] }),
    });

    const res = await fetchRutas({ fetchImpl: mockFetch });
    expect(res.source).toBe('pwa-bundled-wp-empty');
    expect(res.rutas).toHaveLength(3);
  });

  it('opera sin errores en modo offline cuando no hay conexión con la API', async () => {
    const failingFetch = async () => {
      throw new Error('Network offline');
    };

    const res = await fetchRutas({ fetchImpl: failingFetch });
    expect(res.source).toBe('pwa-bundled');
    expect(res.rutas).toHaveLength(defaultCurriculum.length);
  });

  it('encuentra rutas y módulos por slug', () => {
    const ruta = findRutaBySlug(defaultCurriculum, 'introduccion-programacion-python');
    expect(ruta).not.toBeNull();
    const mod = findModuloBySlug(ruta, 'variables-y-costos-de-cosecha');
    expect(mod).not.toBeNull();
    expect(mod.tipoLaboratorio).toBe('python-cosecha');
  });
});
