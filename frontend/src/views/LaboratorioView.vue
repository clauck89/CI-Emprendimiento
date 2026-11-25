<script setup>
import { ref } from 'vue';
import BlockLogicLab from '../components/BlockLogicLab.vue';
import WebSandboxLab from '../components/WebSandboxLab.vue';
import PythonRuralLab from '../components/PythonRuralLab.vue';

const activeLab = ref('web');
</script>

<template>
  <div class="container page-pad">
    <p class="eyebrow">Práctica directa en el navegador · Sin instalar programas</p>
    <h1>Centro de Laboratorios Interactivos</h1>
    <p class="muted" style="max-width: 70ch">
      Todos los laboratorios corren 100% en tu dispositivo sin consumir datos móviles adicionales.
      Elige el taller según la ruta en la que estés estudiando.
    </p>

    <div class="row" role="tablist" aria-label="Seleccionar laboratorio interactivo" style="margin: 1.25rem 0">
      <button
        type="button"
        role="tab"
        :aria-selected="activeLab === 'bloques'"
        :class="['btn', activeLab === 'bloques' ? 'btn-primary' : 'btn-secondary']"
        @click="activeLab = 'bloques'"
      >
        Ruta 1 · Algoritmos por bloques
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeLab === 'web'"
        :class="['btn', activeLab === 'web' ? 'btn-primary' : 'btn-secondary']"
        @click="activeLab = 'web'"
      >
        Ruta 2 · Sandbox Web (HTML/CSS/JS)
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeLab === 'python'"
        :class="['btn', activeLab === 'python' ? 'btn-primary' : 'btn-secondary']"
        @click="activeLab = 'python'"
      >
        Ruta 3 · Taller Python Rural
      </button>
    </div>

    <BlockLogicLab v-if="activeLab === 'bloques'" />
    <WebSandboxLab v-else-if="activeLab === 'web'" initial-preset="proyecto-final" />
    <PythonRuralLab v-else initial-mode="cosecha" />
  </div>
</template>

<style scoped>
.page-pad {
  padding-top: 2rem;
  padding-bottom: 3rem;
}
</style>
