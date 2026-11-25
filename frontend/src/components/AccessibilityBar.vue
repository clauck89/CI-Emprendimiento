<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { preferences, adjustFontScale, resetPreferences } from '../stores/preferences.js';

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
const announcement = ref('');

function updateOnline() {
  isOnline.value = navigator.onLine;
  announcement.value = isOnline.value
    ? 'Conexión restablecida.'
    : 'Sin conexión a internet. VeredaCode continúa funcionando en modo offline.';
}

function handleFont(delta) {
  adjustFontScale(delta);
  announcement.value = `Tamaño de texto ajustado al ${preferences.fontScale} por ciento.`;
}

function toggleContrast() {
  preferences.highContrast = !preferences.highContrast;
  announcement.value = preferences.highContrast
    ? 'Modo de alto contraste activado.'
    : 'Modo de contraste estándar activado.';
}

function toggleMotion() {
  preferences.reducedMotion = !preferences.reducedMotion;
  announcement.value = preferences.reducedMotion
    ? 'Animaciones reducidas activadas.'
    : 'Animaciones estándar activadas.';
}

function toggleLowData() {
  preferences.lowDataMode = !preferences.lowDataMode;
  announcement.value = preferences.lowDataMode
    ? 'Modo ahorro de datos activado.'
    : 'Modo ahorro de datos desactivado.';
}

function handleReset() {
  resetPreferences();
  announcement.value = 'Preferencias de accesibilidad restablecidas.';
}

onMounted(() => {
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnline);
  window.removeEventListener('offline', updateOnline);
});
</script>

<template>
  <div class="a11y-bar" role="region" aria-label="Controles de accesibilidad y conexión">
    <div class="container a11y-inner">
      <div class="a11y-status">
        <span :class="['status-dot', isOnline ? 'online' : 'offline']" aria-hidden="true"></span>
        <span>{{ isOnline ? 'En línea' : 'Sin conexión · Modo Offline activo' }}</span>
      </div>

      <div class="a11y-controls">
        <span class="a11y-label">Accesibilidad WCAG:</span>
        <button
          type="button"
          class="a11y-btn"
          @click="handleFont(-1)"
          :disabled="preferences.fontScale <= 90"
          aria-label="Disminuir tamaño de texto"
        >
          A-
        </button>
        <span class="font-indicator" aria-hidden="true">{{ preferences.fontScale }}%</span>
        <button
          type="button"
          class="a11y-btn"
          @click="handleFont(1)"
          :disabled="preferences.fontScale >= 130"
          aria-label="Aumentar tamaño de texto"
        >
          A+
        </button>

        <button
          type="button"
          class="a11y-btn"
          :aria-pressed="preferences.highContrast"
          @click="toggleContrast"
        >
          Alto contraste
        </button>

        <button
          type="button"
          class="a11y-btn"
          :aria-pressed="preferences.reducedMotion"
          @click="toggleMotion"
        >
          Sin animaciones
        </button>

        <button
          type="button"
          class="a11y-btn"
          :aria-pressed="preferences.lowDataMode"
          @click="toggleLowData"
        >
          Ahorro de datos
        </button>

        <button type="button" class="a11y-btn" @click="handleReset" title="Restablecer preferencias">
          Restablecer
        </button>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </div>
</template>

<style scoped>
.a11y-bar {
  background: var(--bg-code);
  border-bottom: 1px solid var(--border);
  font-size: 0.82rem;
}

.a11y-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}

.a11y-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-muted);
  font-weight: 600;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.online {
  background: var(--success);
}

.status-dot.offline {
  background: var(--warning);
}

.a11y-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.a11y-label {
  color: var(--text-muted);
  margin-right: 0.2rem;
}

.font-indicator {
  color: var(--text);
  font-weight: 700;
  min-width: 2.6rem;
  text-align: center;
}

.a11y-btn {
  background: var(--bg-elevated);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  padding: 0.25rem 0.55rem;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.a11y-btn:hover:not(:disabled) {
  border-color: var(--accent);
}

.a11y-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.a11y-btn[aria-pressed='true'] {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
}
</style>
