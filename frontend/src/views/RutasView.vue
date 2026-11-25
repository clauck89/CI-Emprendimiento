<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { curriculumState, loadCurriculum, getSourceLabel } from '../stores/curriculum.js';
import { getRutaProgress } from '../stores/progress.js';

const search = ref('');
const nivelFiltro = ref('todos');

const filteredRutas = computed(() => {
  const q = search.value.trim().toLowerCase();
  return curriculumState.rutas.filter((ruta) => {
    const matchesNivel =
      nivelFiltro.value === 'todos' || String(ruta.rutaNumero) === nivelFiltro.value;
    if (!matchesNivel) return false;
    if (!q) return true;

    const inRuta =
      ruta.titulo.toLowerCase().includes(q) ||
      ruta.descripcion.toLowerCase().includes(q) ||
      ruta.nivel.toLowerCase().includes(q);
    const inModulos = (ruta.modulos || []).some(
      (m) => m.titulo.toLowerCase().includes(q) || m.resumen.toLowerCase().includes(q)
    );
    return inRuta || inModulos;
  });
});
</script>

<template>
  <div class="container page-pad">
    <div class="page-head">
      <div>
        <p class="eyebrow">Catálogo educativo · De menos a más</p>
        <h1>Rutas de aprendizaje VeredaCode</h1>
        <p class="muted">
          Todas las rutas están diseñadas en texto liviano + práctica interactiva para funcionar en
          zonas con poca señal o sin conexión.
        </p>
      </div>
      <div class="row">
        <span class="badge badge-neutral">{{ getSourceLabel(curriculumState.source) }}</span>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="curriculumState.loading"
          @click="loadCurriculum({ force: true })"
        >
          {{ curriculumState.loading ? 'Sincronizando...' : 'Sincronizar con CMS' }}
        </button>
      </div>
    </div>

    <div class="card filter-bar" role="search" aria-label="Filtrar rutas educativas">
      <div class="search-field">
        <label for="busqueda-rutas" class="sr-only">Buscar rutas o temas</label>
        <input
          id="busqueda-rutas"
          v-model="search"
          type="search"
          placeholder="Buscar por tema (ej. HTML, Python, cosecha, bloques, seguridad)..."
        />
      </div>
      <div class="row">
        <button
          type="button"
          :class="['btn', 'btn-sm', nivelFiltro === 'todos' ? 'btn-primary' : 'btn-secondary']"
          @click="nivelFiltro = 'todos'"
        >
          Todas (3)
        </button>
        <button
          type="button"
          :class="['btn', 'btn-sm', nivelFiltro === '1' ? 'btn-primary' : 'btn-secondary']"
          @click="nivelFiltro = '1'"
        >
          Ruta 1 · Inicial
        </button>
        <button
          type="button"
          :class="['btn', 'btn-sm', nivelFiltro === '2' ? 'btn-primary' : 'btn-secondary']"
          @click="nivelFiltro = '2'"
        >
          Ruta 2 · Web Piloto
        </button>
        <button
          type="button"
          :class="['btn', 'btn-sm', nivelFiltro === '3' ? 'btn-primary' : 'btn-secondary']"
          @click="nivelFiltro = '3'"
        >
          Ruta 3 · Python
        </button>
      </div>
    </div>

    <div v-if="filteredRutas.length" class="stack" style="margin-top: 1.5rem">
      <article v-for="ruta in filteredRutas" :key="ruta.slug" class="card ruta-item">
        <div class="ruta-item-top">
          <div>
            <div class="row" style="margin-bottom: 0.5rem">
              <span class="badge">{{ ruta.nivel }}</span>
              <span class="badge badge-amber">{{ ruta.etiqueta }}</span>
              <span class="badge badge-neutral">{{ ruta.duracion }} · ~{{ ruta.pesoKb }} KB</span>
            </div>
            <h2>{{ ruta.titulo }}</h2>
            <p class="muted">{{ ruta.descripcion }}</p>
            <p class="req-line"><strong>Requisitos:</strong> {{ ruta.requisitos }}</p>
          </div>

          <div class="ruta-actions">
            <div class="progress-summary">
              <strong>{{ getRutaProgress(ruta).percent }}%</strong>
              <span class="muted">
                ({{ getRutaProgress(ruta).completed }}/{{ getRutaProgress(ruta).total }} módulos)
              </span>
            </div>
            <RouterLink :to="`/rutas/${ruta.slug}`" class="btn btn-primary">
              Ver ruta y módulos
            </RouterLink>
          </div>
        </div>

        <ol class="mini-modules">
          <li v-for="mod in ruta.modulos" :key="mod.slug">
            <RouterLink :to="`/rutas/${ruta.slug}/modulo/${mod.slug}`">
              Módulo {{ mod.orden }}: {{ mod.titulo }}
            </RouterLink>
            <span class="muted"> ({{ mod.duracionMin }} min)</span>
          </li>
        </ol>
      </article>
    </div>

    <div v-else class="card" style="margin-top: 1.5rem">
      <p>No encontramos rutas que coincidan con "<strong>{{ search }}</strong>".</p>
      <button type="button" class="btn btn-secondary btn-sm" @click="search = ''; nivelFiltro = 'todos'">
        Mostrar todas las rutas
      </button>
    </div>
  </div>
</template>

<style scoped>
.page-pad {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.85rem;
}

.search-field {
  flex: 1 1 280px;
}

.ruta-item-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.ruta-item-top > div:first-child {
  flex: 1 1 480px;
}

.req-line {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.ruta-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.65rem;
  min-width: 190px;
}

.progress-summary {
  font-size: 0.95rem;
}

.mini-modules {
  margin: 0.85rem 0 0;
  padding: 0.85rem 0 0 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
</style>
