<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { curriculumState } from '../stores/curriculum.js';
import { getRutaProgress, getGlobalProgress } from '../stores/progress.js';

const globalProgress = computed(() => getGlobalProgress(curriculumState.rutas));
</script>

<template>
  <div class="home-page">
    <!-- Hero principal -->
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">ODS 4 · Educación de Calidad · PWA de Bajo Consumo</p>
          <h1>Aprende tecnología desde tu vereda, incluso con poca señal</h1>
          <p class="hero-lead muted">
            <strong>VeredaCode</strong> es una plataforma educativa rápida, en modo oscuro y
            accesible (WCAG 2.1). Sin videos pesados: aprende leyendo, practicando directo en tu
            navegador y guardando tu avance sin conexión.
          </p>
          <div class="row" style="margin-top: 1.25rem">
            <RouterLink to="/rutas/desarrollo-web-desde-cero" class="btn btn-primary">
              Comenzar curso piloto (Web)
            </RouterLink>
            <RouterLink to="/rutas" class="btn btn-secondary">
              Ver las 3 rutas completas
            </RouterLink>
            <RouterLink to="/laboratorio" class="btn btn-teal">
              Abrir laboratorio offline
            </RouterLink>
          </div>
        </div>

        <aside class="card progress-card" aria-label="Resumen de tu progreso">
          <p class="eyebrow">Tu avance local (guardado en este equipo)</p>
          <h2>{{ globalProgress.percent }}% completado</h2>
          <div
            class="progress-track"
            role="progressbar"
            :aria-valuenow="globalProgress.percent"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Porcentaje global de módulos completados"
          >
            <div class="progress-fill" :style="{ width: `${globalProgress.percent}%` }"></div>
          </div>
          <p class="muted" style="margin-top: 0.65rem">
            {{ globalProgress.completed }} de {{ globalProgress.total }} módulos terminados en las 3
            rutas progresivas.
          </p>

          <dl class="metrics-row">
            <div>
              <dt>Formato</dt>
              <dd>Texto + Práctica</dd>
            </div>
            <div>
              <dt>Consumo</dt>
              <dd>&lt; 150 KB</dd>
            </div>
            <div>
              <dt>Estándar</dt>
              <dd>WCAG 2.1 AA</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>

    <!-- Las 3 Rutas de menos a más -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Recorrido progresivo · De menos a más</p>
            <h2>Tres rutas diseñadas para funcionar con baja conectividad</h2>
          </div>
          <RouterLink to="/rutas" class="btn btn-secondary btn-sm">Explorar catálogo</RouterLink>
        </div>

        <div class="grid-3">
          <article
            v-for="ruta in curriculumState.rutas"
            :key="ruta.slug"
            :class="['card', 'ruta-card', { featured: ruta.rutaNumero === 2 }]"
          >
            <div class="row" style="justify-content: space-between">
              <span class="badge">{{ ruta.nivel }}</span>
              <span class="badge badge-neutral">~{{ ruta.pesoKb }} KB</span>
            </div>

            <h3 class="ruta-title">{{ ruta.titulo }}</h3>
            <p v-if="ruta.etiqueta" class="ruta-tag">{{ ruta.etiqueta }}</p>
            <p class="muted">{{ ruta.descripcion }}</p>

            <div class="ruta-meta">
              <span>{{ ruta.modulos.length }} módulos</span>
              <span>·</span>
              <span>{{ ruta.duracion }}</span>
              <span>·</span>
              <span>{{ getRutaProgress(ruta).percent }}% avance</span>
            </div>

            <div class="progress-track" aria-hidden="true" style="margin: 0.5rem 0 1rem">
              <div
                class="progress-fill"
                :style="{ width: `${getRutaProgress(ruta).percent}%` }"
              ></div>
            </div>

            <RouterLink
              :to="`/rutas/${ruta.slug}`"
              :class="['btn', ruta.rutaNumero === 2 ? 'btn-primary' : 'btn-secondary']"
              style="width: 100%"
            >
              Entrar a la Ruta {{ ruta.rutaNumero }}
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <!-- Arquitectura moderna desacoplada (inspirada en el diagrama del proyecto) -->
    <section class="section arch-section">
      <div class="container">
        <p class="eyebrow">Cómo funciona VeredaCode</p>
        <h2>Arquitectura moderna, desacoplada y lista para escalar</h2>
        <div class="arch-flow">
          <div class="card arch-card highlight">
            <span class="eyebrow" style="color: var(--accent)">Estudiante</span>
            <h3>PWA en Vue 3 + Vite</h3>
            <p class="muted">Interfaz rápida en modo oscuro, de una sola página y uso sin conexión.</p>
          </div>
          <div class="arch-arrow decorative-visual" aria-hidden="true">→</div>
          <div class="card arch-card">
            <span class="eyebrow">Servidor Web</span>
            <h3>Nginx</h3>
            <p class="muted">Proxy inverso, compresión Gzip y entrega eficiente de archivos estáticos.</p>
          </div>
          <div class="arch-arrow decorative-visual" aria-hidden="true">→</div>
          <div class="card arch-card">
            <span class="eyebrow">Contenidos</span>
            <h3>WordPress Headless</h3>
            <p class="muted">Gestiona cursos y módulos (FPM); los expone en JSON vía API REST.</p>
          </div>
          <div class="arch-arrow decorative-visual" aria-hidden="true">→</div>
          <div class="card arch-card">
            <span class="eyebrow">Datos</span>
            <h3>MySQL 8.0</h3>
            <p class="muted">Base de datos aislada en su propio contenedor con volumen persistente.</p>
          </div>
        </div>
        <div class="arch-footer">
          Todo corre en <strong>contenedores Docker</strong> sobre Linux, con el código en
          <strong>GitHub</strong> e integración continua.
          <RouterLink to="/acerca" style="margin-left: 0.5rem">Ver estado técnico →</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 2.75rem 0 2rem;
  border-bottom: 1px solid var(--border);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 1.75rem;
  align-items: center;
}

@media (max-width: 860px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

.hero-lead {
  font-size: 1.08rem;
  max-width: 60ch;
}

.progress-card {
  border-color: var(--border-strong);
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.metrics-row dt {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.metrics-row dd {
  margin: 0.15rem 0 0;
  font-weight: 800;
  font-size: 0.92rem;
  color: var(--accent);
}

.section {
  padding: 2.5rem 0;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.ruta-card {
  display: flex;
  flex-direction: column;
}

.ruta-card.featured {
  border-color: var(--accent);
}

.ruta-title {
  margin-top: 0.85rem;
  margin-bottom: 0.35rem;
  font-size: 1.2rem;
}

.ruta-tag {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.ruta-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.84rem;
  color: var(--text-muted);
  margin-top: auto;
  padding-top: 0.65rem;
}

.arch-section {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
}

.arch-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: 0.75rem;
  align-items: stretch;
  margin-top: 1.25rem;
}

@media (max-width: 960px) {
  .arch-flow {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .arch-arrow {
    display: none;
  }
}

.arch-card {
  display: flex;
  flex-direction: column;
}

.arch-card.highlight {
  border-color: var(--accent);
  background: var(--bg-code);
}

.arch-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--teal);
}

.arch-footer {
  margin-top: 1.25rem;
  padding: 0.95rem 1.25rem;
  border-radius: var(--radius);
  background: var(--bg-code);
  border: 1px solid var(--border-strong);
  font-size: 0.95rem;
}

.arch-footer strong {
  color: var(--accent);
}
</style>
