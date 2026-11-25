<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { curriculumState, getSourceLabel } from '../stores/curriculum.js';

const route = useRoute();
const menuOpen = ref(false);

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/rutas', label: 'Rutas de aprendizaje' },
  { to: '/laboratorio', label: 'Laboratorio' },
  { to: '/acerca', label: 'Arquitectura y ODS 4' },
];

function closeMenu() {
  menuOpen.value = false;
}
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" @click="closeMenu">
        <img
          src="/favicon.svg"
          alt=""
          width="36"
          height="36"
          class="brand-logo"
          aria-hidden="true"
        />
        <span class="brand-text">
          <strong>VeredaCode</strong>
          <small>Educación tecnológica · ODS 4</small>
        </span>
      </RouterLink>

      <button
        type="button"
        class="menu-toggle btn btn-secondary btn-sm"
        :aria-expanded="menuOpen"
        aria-controls="navegacion-principal"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? 'Cerrar menú' : 'Menú' }}
      </button>

      <nav
        id="navegacion-principal"
        aria-label="Navegación principal"
        :class="['main-nav', { open: menuOpen }]"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :aria-current="route.path === item.to ? 'page' : undefined"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <span class="source-pill" :title="getSourceLabel(curriculumState.source)">
          {{
            curriculumState.source === 'wordpress-headless'
              ? 'API WordPress'
              : 'PWA Offline Ready'
          }}
        </span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 68px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text);
}

.brand-logo {
  flex-shrink: 0;
  border-radius: 8px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}

.brand-text small {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.menu-toggle {
  display: none;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.nav-link:hover {
  background: var(--bg-card);
  color: var(--accent);
}

.nav-link.router-link-active {
  background: rgba(229, 154, 60, 0.14);
  border-color: rgba(229, 154, 60, 0.45);
  color: var(--accent);
}

.source-pill {
  margin-left: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  background: rgba(21, 97, 84, 0.45);
  color: #8bf0dc;
  border: 1px solid rgba(47, 168, 144, 0.5);
}

@media (max-width: 820px) {
  .menu-toggle {
    display: inline-flex;
  }

  .header-inner {
    flex-wrap: wrap;
  }

  .main-nav {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 0 0.75rem;
    border-top: 1px solid var(--border);
  }

  .main-nav.open {
    display: flex;
  }

  .source-pill {
    margin-left: 0;
    align-self: flex-start;
    margin-top: 0.35rem;
  }
}
</style>
