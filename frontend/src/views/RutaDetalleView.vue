<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { curriculumState } from '../stores/curriculum.js';
import { findRutaBySlug } from '../services/cmsApi.js';
import { isModuleCompleted, getRutaProgress } from '../stores/progress.js';

const route = useRoute();

const ruta = computed(() => findRutaBySlug(curriculumState.rutas, route.params.slug));
const progreso = computed(() => getRutaProgress(ruta.value));

const siguienteModulo = computed(() => {
  if (!ruta.value?.modulos?.length) return null;
  return (
    ruta.value.modulos.find((m) => !isModuleCompleted(ruta.value.slug, m.slug)) ||
    ruta.value.modulos[0]
  );
});
</script>

<template>
  <div class="container page-pad">
    <nav aria-label="Ruta de navegación" class="breadcrumb">
      <RouterLink to="/">Inicio</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink to="/rutas">Rutas</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ ruta ? ruta.nivel : 'No encontrada' }}</span>
    </nav>

    <template v-if="ruta">
      <header class="card ruta-hero">
        <div class="row" style="margin-bottom: 0.6rem">
          <span class="badge">{{ ruta.nivel }}</span>
          <span class="badge badge-amber">{{ ruta.etiqueta }}</span>
          <span class="badge badge-neutral">Duración: {{ ruta.duracion }}</span>
          <span class="badge badge-neutral">Consumo estimado: ~{{ ruta.pesoKb }} KB</span>
        </div>

        <h1>{{ ruta.titulo }}</h1>
        <p class="muted" style="max-width: 72ch">{{ ruta.descripcion }}</p>
        <p><strong>Requisitos previos:</strong> <span class="muted">{{ ruta.requisitos }}</span></p>

        <div class="progress-wrap">
          <div class="row" style="justify-content: space-between; margin-bottom: 0.4rem">
            <strong>Tu avance en esta ruta</strong>
            <span>{{ progreso.completed }} de {{ progreso.total }} módulos ({{ progreso.percent }}%)</span>
          </div>
          <div
            class="progress-track"
            role="progressbar"
            :aria-valuenow="progreso.percent"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="progress-fill" :style="{ width: `${progreso.percent}%` }"></div>
          </div>
        </div>

        <div class="row" style="margin-top: 1.25rem">
          <RouterLink
            v-if="siguienteModulo"
            :to="`/rutas/${ruta.slug}/modulo/${siguienteModulo.slug}`"
            class="btn btn-primary"
          >
            {{ progreso.completed > 0 ? 'Continuar siguiente módulo' : 'Iniciar Módulo 1' }}
          </RouterLink>
          <RouterLink to="/laboratorio" class="btn btn-teal">
            Ir al laboratorio interactivo
          </RouterLink>
        </div>
      </header>

      <section v-if="ruta.objetivos?.length" class="card" style="margin-top: 1.25rem">
        <h2>¿Qué lograrás en esta ruta?</h2>
        <ul class="obj-list">
          <li v-for="(obj, i) in ruta.objetivos" :key="i">{{ obj }}</li>
        </ul>
      </section>

      <section style="margin-top: 1.75rem" aria-labelledby="temario-heading">
        <h2 id="temario-heading">Módulos de estudio ({{ ruta.modulos.length }})</h2>
        <div class="stack">
          <article
            v-for="mod in ruta.modulos"
            :key="mod.slug"
            :class="['card', 'mod-card', { done: isModuleCompleted(ruta.slug, mod.slug) }]"
          >
            <div class="mod-row">
              <div>
                <div class="row" style="margin-bottom: 0.35rem">
                  <span class="badge badge-neutral">Módulo {{ mod.orden }}</span>
                  <span class="badge badge-neutral">{{ mod.duracionMin }} min</span>
                  <span v-if="mod.tipoLaboratorio && mod.tipoLaboratorio !== 'none'" class="badge">
                    Incluye laboratorio interactivo
                  </span>
                  <span v-if="isModuleCompleted(ruta.slug, mod.slug)" class="badge badge-amber">
                    Completado
                  </span>
                </div>
                <h3>{{ mod.titulo }}</h3>
                <p class="muted" style="margin-bottom: 0">{{ mod.resumen }}</p>
              </div>
              <RouterLink
                :to="`/rutas/${ruta.slug}/modulo/${mod.slug}`"
                class="btn btn-secondary"
              >
                {{ isModuleCompleted(ruta.slug, mod.slug) ? 'Repasar módulo' : 'Estudiar módulo' }}
              </RouterLink>
            </div>
          </article>
        </div>
      </section>
    </template>

    <div v-else class="card">
      <h1>Ruta no encontrada</h1>
      <p class="muted">La ruta educativa solicitada no existe o fue movida.</p>
      <RouterLink to="/rutas" class="btn btn-primary">Volver al catálogo de rutas</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page-pad {
  padding-top: 1.5rem;
  padding-bottom: 3rem;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.ruta-hero {
  border-color: var(--border-strong);
}

.progress-wrap {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.obj-list {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.mod-card.done {
  border-color: var(--teal);
}

.mod-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.mod-row > div:first-child {
  flex: 1 1 420px;
}
</style>
