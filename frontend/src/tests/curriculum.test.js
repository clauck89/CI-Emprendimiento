import { describe, it, expect, beforeEach } from 'vitest';
import { defaultCurriculum } from '../data/defaultCurriculum.js';
import {
  progressState,
  toggleModuleCompleted,
  isModuleCompleted,
  getRutaProgress,
  getGlobalProgress,
  exportProgressJson,
  importProgressJson,
} from '../stores/progress.js';

describe('Currículo progresivo VeredaCode (3 rutas)', () => {
  it('incluye exactamente las 3 rutas ordenadas de menor a mayor complejidad', () => {
    expect(defaultCurriculum).toHaveLength(3);
    expect(defaultCurriculum.map((r) => r.rutaNumero)).toEqual([1, 2, 3]);
    expect(defaultCurriculum[0].slug).toBe('alfabetizacion-digital-pensamiento-computacional');
    expect(defaultCurriculum[1].slug).toBe('desarrollo-web-desde-cero');
    expect(defaultCurriculum[2].slug).toBe('introduccion-programacion-python');
  });

  it('mantiene bajo consumo de datos (< 100 KB por ruta) y módulos completos', () => {
    for (const ruta of defaultCurriculum) {
      expect(ruta.pesoKb).toBeLessThan(100);
      expect(ruta.modulos.length).toBeGreaterThanOrEqual(3);
      for (const mod of ruta.modulos) {
        expect(mod.titulo.length).toBeGreaterThan(5);
        expect(mod.resumen.length).toBeGreaterThan(10);
      }
    }
  });
});

describe('Seguimiento de progreso offline y respaldo JSON', () => {
  beforeEach(() => {
    progressState.completed = [];
  });

  it('marca y desmarca módulos y calcula porcentajes correctamente', () => {
    const rutaWeb = defaultCurriculum[1];
    const mod1 = rutaWeb.modulos[0];

    expect(isModuleCompleted(rutaWeb.slug, mod1.slug)).toBe(false);
    toggleModuleCompleted(rutaWeb.slug, mod1.slug);
    expect(isModuleCompleted(rutaWeb.slug, mod1.slug)).toBe(true);

    const progRuta = getRutaProgress(rutaWeb);
    expect(progRuta.completed).toBe(1);
    expect(progRuta.total).toBe(3);
    expect(progRuta.percent).toBe(33);

    const globalProg = getGlobalProgress(defaultCurriculum);
    expect(globalProg.completed).toBe(1);
    expect(globalProg.total).toBe(9);
  });

  it('exporta e importa el progreso en formato JSON para equipos compartidos', () => {
    toggleModuleCompleted('desarrollo-web-desde-cero', 'html-semantico-y-accesible');
    const json = exportProgressJson();

    progressState.completed = [];
    const restoredCount = importProgressJson(json);

    expect(restoredCount).toBe(1);
    expect(isModuleCompleted('desarrollo-web-desde-cero', 'html-semantico-y-accesible')).toBe(true);
  });
});
