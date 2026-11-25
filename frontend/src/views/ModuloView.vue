<script setup>
import { ref, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { curriculumState } from '../stores/curriculum.js';
import { findRutaBySlug, findModuloBySlug } from '../services/cmsApi.js';
import { isModuleCompleted, toggleModuleCompleted } from '../stores/progress.js';
import CodeBlock from '../components/CodeBlock.vue';
import BlockLogicLab from '../components/BlockLogicLab.vue';
import WebSandboxLab from '../components/WebSandboxLab.vue';
import PythonRuralLab from '../components/PythonRuralLab.vue';

const route = useRoute();
const announcement = ref('');

const ruta = computed(() => findRutaBySlug(curriculumState.rutas, route.params.slug));
const modulo = computed(() => findModuloBySlug(ruta.value, route.params.moduloSlug));

const currentIndex = computed(() => {
  if (!ruta.value || !modulo.value) return -1;
  return ruta.value.modulos.findIndex((m) => m.slug === modulo.value.slug);
});

const prevModulo = computed(() =>
  currentIndex.value > 0 ? ruta.value.modulos[currentIndex.value - 1] : null
);
const nextModulo = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < ruta.value.modulos.length - 1
    ? ruta.value.modulos[currentIndex.value + 1]
    : null
);

const completed = computed(() =>
  ruta.value && modulo.value ? isModuleCompleted(ruta.value.slug, modulo.value.slug) : false
);

function handleToggleComplete() {
  if (!ruta.value || !modulo.value) return;
  const isNowDone = toggleModuleCompleted(ruta.value.slug, modulo.value.slug);
  announcement.value = isNowDone
    ? `Módulo "${modulo.value.titulo}" marcado como completado.`
    : `Módulo "${modulo.value.titulo}" marcado como pendiente.`;
}
</script>

<template>
  <div class="container page-pad">
    <nav aria-label="Ruta de navegación" class="breadcrumb">
      <RouterLink to="/">Inicio</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink to="/rutas">Rutas</RouterLink>
      <template v-if="ruta">
        <span aria-hidden="true">/</span>
        <RouterLink :to="`/rutas/${ruta.slug}`">{{ ruta.nivel }}</RouterLink>
      </template>
      <template v-if="modulo">
        <span aria-hidden="true">/</span>
        <span aria-current="page">Módulo {{ modulo.orden }}</span>
      </template>
    </nav>

    <article v-if="ruta && modulo" class="lesson-article">
      <header class="lesson-header">
        <div class="row" style="margin-bottom: 0.6rem">
          <span class="badge">{{ ruta.nivel }}</span>
          <span class="badge badge-neutral">Módulo {{ modulo.orden }} de {{ ruta.modulos.length }}</span>
          <span class="badge badge-neutral">{{ modulo.duracionMin }} min de lectura y práctica</span>
          <span v-if="completed" class="badge badge-amber">Completado</span>
        </div>

        <h1>{{ modulo.titulo }}</h1>
        <p class="lead muted">{{ modulo.resumen }}</p>

        <div v-if="modulo.objetivo" class="objective-box">
          <strong>Objetivo del módulo:</strong> {{ modulo.objetivo }}
        </div>
      </header>

      <!-- Contenido principal -->
      <section class="card lesson-body" v-html="modulo.contenidoHtml"></section>

      <!-- Bloque de código -->
      <section v-if="modulo.codigoEjemplo" style="margin-top: 1.5rem">
        <h2>Ejemplo práctico de referencia</h2>
        <CodeBlock
          :code="modulo.codigoEjemplo"
          :language="modulo.lenguajeCodigo || 'text'"
          :filename="`${modulo.slug}.${modulo.lenguajeCodigo === 'python' ? 'py' : modulo.lenguajeCodigo === 'javascript' ? 'js' : modulo.lenguajeCodigo === 'html' ? 'html' : modulo.lenguajeCodigo === 'css' ? 'css' : 'txt'}`"
        />
      </section>

      <!-- Laboratorio embebido según el tipo de módulo -->
      <BlockLogicLab v-if="modulo.tipoLaboratorio === 'bloques'" />
      <WebSandboxLab
        v-else-if="modulo.tipoLaboratorio === 'web-sandbox'"
        :initial-preset="modulo.labPreset || 'proyecto-final'"
      />
      <PythonRuralLab
        v-else-if="modulo.tipoLaboratorio === 'python-cosecha'"
        initial-mode="cosecha"
      />
      <PythonRuralLab
        v-else-if="modulo.tipoLaboratorio === 'python-inventario'"
        initial-mode="inventario"
      />

      <!-- Actividad práctica en papel / sin conexión -->
      <section v-if="modulo.ejercicioPapel" class="card paper-box" aria-labelledby="actividad-papel-title">
        <p class="eyebrow">Práctica desconectada (Papel y comunidad)</p>
        <h2 id="actividad-papel-title">Actividad fuera de pantalla</h2>
        <p style="margin-bottom: 0">{{ modulo.ejercicioPapel }}</p>
      </section>

      <!-- Repositorio de código si aplica -->
      <section v-if="modulo.repoUrl" class="card repo-box">
        <div class="row" style="justify-content: space-between">
          <div>
            <strong>Repositorio de código del proyecto</strong>
            <p class="muted" style="margin: 0.2rem 0 0">
              Explora la estructura de archivos y práctica de integración continua en GitHub.
            </p>
          </div>
          <a :href="modulo.repoUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            Abrir repositorio
          </a>
        </div>
      </section>

      <!-- Cierre y navegación entre módulos -->
      <footer class="card lesson-footer">
        <div class="row" style="justify-content: space-between">
          <button
            type="button"
            :class="['btn', completed ? 'btn-teal' : 'btn-primary']"
            :aria-pressed="completed"
            @click="handleToggleComplete"
          >
            {{ completed ? '✓ Módulo completado (clic para desmarcar)' : 'Marcar módulo como completado' }}
          </button>

          <div class="row">
            <RouterLink
              v-if="prevModulo"
              :to="`/rutas/${ruta.slug}/modulo/${prevModulo.slug}`"
              class="btn btn-secondary"
            >
              ← Anterior
            </RouterLink>
            <RouterLink
              v-if="nextModulo"
              :to="`/rutas/${ruta.slug}/modulo/${nextModulo.slug}`"
              class="btn btn-primary"
            >
              Siguiente módulo →
            </RouterLink>
            <RouterLink v-else :to="`/rutas/${ruta.slug}`" class="btn btn-secondary">
              Volver a la ruta
            </RouterLink>
          </div>
        </div>
      </footer>

      <p class="sr-only" aria-live="polite">{{ announcement }}</p>
    </article>

    <div v-else class="card">
      <h1>Módulo no encontrado</h1>
      <p class="muted">No pudimos encontrar el módulo solicitado.</p>
      <RouterLink to="/rutas" class="btn btn-primary">Ir al catálogo de rutas</RouterLink>
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

.lesson-header {
  margin-bottom: 1.25rem;
}

.lead {
  font-size: 1.06rem;
  max-width: 72ch;
}

.objective-box {
  background: rgba(47, 168, 144, 0.12);
  border: 1px solid rgba(47, 168, 144, 0.45);
  border-left: 4px solid var(--teal);
  border-radius: var(--radius-sm);
  padding: 0.85rem 1rem;
  margin-top: 1rem;
}

.lesson-body :deep(h3) {
  margin-top: 1.2rem;
  color: var(--accent);
}

.lesson-body :deep(ul),
.lesson-body :deep(ol) {
  padding-left: 1.35rem;
  margin: 0.5rem 0 1rem;
}

.lesson-body :deep(li) {
  margin-bottom: 0.4rem;
}

.paper-box {
  margin-top: 1.5rem;
  border-left: 4px solid var(--accent);
}

.repo-box {
  margin-top: 1rem;
}

.lesson-footer {
  margin-top: 1.75rem;
  border-color: var(--border-strong);
}
</style>
