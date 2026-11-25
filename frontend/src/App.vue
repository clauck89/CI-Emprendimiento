<script setup>
import { onMounted } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import AccessibilityBar from './components/AccessibilityBar.vue';
import AppHeader from './components/AppHeader.vue';
import { loadCurriculum } from './stores/curriculum.js';

onMounted(() => {
  loadCurriculum();
});
</script>

<template>
  <div class="app-shell">
    <a href="#contenido-principal" class="skip-link">Saltar al contenido principal</a>
    <AccessibilityBar />
    <AppHeader />

    <main id="contenido-principal" tabindex="-1" class="app-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>VeredaCode</strong> · Plataforma Educativa de Base Tecnológica (ODS 4)
          <p class="muted" style="margin: 0.25rem 0 0; font-size: 0.86rem">
            PWA en Vue 3 + Vite · Nginx · Headless WordPress (FPM) · MySQL 8.0 · Docker
          </p>
        </div>
        <div class="row">
          <RouterLink to="/rutas">Rutas</RouterLink>
          <RouterLink to="/laboratorio">Laboratorio</RouterLink>
          <RouterLink to="/acerca">Accesibilidad y Arquitectura</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}

.site-footer {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
  padding: 1.5rem 0;
  margin-top: 2rem;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
</style>
