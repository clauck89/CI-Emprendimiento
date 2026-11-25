<script setup>
import { ref, watch, computed } from 'vue';
import { webSandboxPresets } from '../data/defaultCurriculum.js';

const props = defineProps({
  initialPreset: {
    type: String,
    default: 'proyecto-final',
  },
});

const presetKey = ref(webSandboxPresets[props.initialPreset] ? props.initialPreset : 'proyecto-final');
const activeTab = ref('html');
const htmlCode = ref(webSandboxPresets[presetKey.value].html);
const cssCode = ref(webSandboxPresets[presetKey.value].css);
const jsCode = ref(webSandboxPresets[presetKey.value].js);
const statusMsg = ref('Vista previa lista. Edita el código y pulsa "Ejecutar cambios".');

function buildDocument(html, css, js) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mi página — VeredaCode</title>
<style>${css}</style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (err) {
  const pre = document.createElement('pre');
  pre.style.color = '#fca5a5';
  pre.style.background = '#2b1215';
  pre.style.padding = '0.75rem';
  pre.style.borderRadius = '8px';
  pre.textContent = 'Error en JavaScript: ' + err.message;
  document.body.appendChild(pre);
}
<${'/script'}>
</body>
</html>`;
}

const previewDoc = ref(buildDocument(htmlCode.value, cssCode.value, jsCode.value));

const approxBytes = computed(() => {
  const size = new Blob([previewDoc.value]).size;
  return (size / 1024).toFixed(1);
});

function loadPreset(key) {
  const target = webSandboxPresets[key];
  if (!target) return;
  presetKey.value = key;
  htmlCode.value = target.html;
  cssCode.value = target.css;
  jsCode.value = target.js;
  runCode();
  statusMsg.value = `Plantilla cargada: ${target.titulo}.`;
}

function runCode() {
  previewDoc.value = buildDocument(htmlCode.value, cssCode.value, jsCode.value);
  statusMsg.value = `Vista previa actualizada (${approxBytes.value} KB).`;
}

function downloadPage() {
  const doc = buildDocument(htmlCode.value, cssCode.value, jsCode.value);
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi-pagina-veredacode.html';
  a.click();
  URL.revokeObjectURL(url);
  statusMsg.value = 'Descargaste mi-pagina-veredacode.html. Puedes abrirlo sin internet en cualquier navegador.';
}

watch(
  () => props.initialPreset,
  (nextKey) => {
    if (nextKey && webSandboxPresets[nextKey]) {
      loadPreset(nextKey);
    }
  }
);
</script>

<template>
  <section class="card sandbox-panel" aria-labelledby="sandbox-web-titulo">
    <div class="sandbox-top">
      <div>
        <p class="eyebrow">Laboratorio Ruta 2 · 100% en el navegador (Sin instalaciones)</p>
        <h3 id="sandbox-web-titulo">Editor Web Interactivo (HTML + CSS + JavaScript)</h3>
      </div>

      <div class="preset-select">
        <label for="preset-picker" class="sr-only">Seleccionar plantilla</label>
        <select
          id="preset-picker"
          :value="presetKey"
          @change="loadPreset($event.target.value)"
        >
          <option v-for="(preset, key) in webSandboxPresets" :key="key" :value="key">
            {{ preset.titulo }}
          </option>
        </select>
      </div>
    </div>

    <div class="sandbox-grid">
      <div class="editor-pane">
        <div class="tabs" role="tablist" aria-label="Lenguajes del editor web">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'html'"
            :class="['tab-btn', { active: activeTab === 'html' }]"
            @click="activeTab = 'html'"
          >
            HTML
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'css'"
            :class="['tab-btn', { active: activeTab === 'css' }]"
            @click="activeTab = 'css'"
          >
            CSS
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'js'"
            :class="['tab-btn', { active: activeTab === 'js' }]"
            @click="activeTab = 'js'"
          >
            JavaScript
          </button>
        </div>

        <label v-if="activeTab === 'html'" class="sr-only" for="editor-html">Código HTML</label>
        <textarea
          v-if="activeTab === 'html'"
          id="editor-html"
          v-model="htmlCode"
          class="code-input editor-area"
          rows="13"
          spellcheck="false"
        ></textarea>

        <label v-if="activeTab === 'css'" class="sr-only" for="editor-css">Código CSS</label>
        <textarea
          v-if="activeTab === 'css'"
          id="editor-css"
          v-model="cssCode"
          class="code-input editor-area"
          rows="13"
          spellcheck="false"
        ></textarea>

        <label v-if="activeTab === 'js'" class="sr-only" for="editor-js">Código JavaScript</label>
        <textarea
          v-if="activeTab === 'js'"
          id="editor-js"
          v-model="jsCode"
          class="code-input editor-area"
          rows="13"
          spellcheck="false"
        ></textarea>

        <div class="row" style="margin-top: 0.75rem">
          <button type="button" class="btn btn-primary" @click="runCode">
            Ejecutar cambios
          </button>
          <button type="button" class="btn btn-teal" @click="downloadPage">
            Descargar mi página (.html)
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="loadPreset(presetKey)">
            Reiniciar plantilla
          </button>
        </div>
      </div>

      <div class="preview-pane">
        <div class="preview-bar">
          <span>Vista previa en vivo</span>
          <span class="badge badge-neutral">Peso de tu página: {{ approxBytes }} KB</span>
        </div>
        <iframe
          class="preview-frame"
          title="Vista previa del código HTML, CSS y JavaScript"
          sandbox="allow-scripts"
          :srcdoc="previewDoc"
        ></iframe>
      </div>
    </div>

    <p class="muted status-line" role="status" aria-live="polite">{{ statusMsg }}</p>
  </section>
</template>

<style scoped>
.sandbox-panel {
  border-color: var(--border-strong);
  margin: 1.5rem 0;
}

.sandbox-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.preset-select {
  min-width: 240px;
}

.sandbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 860px) {
  .sandbox-grid {
    grid-template-columns: 1fr;
  }
}

.tabs {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}

.tab-btn {
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.45rem 0.9rem;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
}

.editor-area {
  min-height: 280px;
  resize: vertical;
}

.preview-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-code);
}

.preview-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  font-weight: 700;
}

.preview-frame {
  width: 100%;
  min-height: 320px;
  flex: 1;
  border: none;
  background: #0e1318;
}

.status-line {
  font-size: 0.86rem;
  margin-top: 0.75rem;
  margin-bottom: 0;
}
</style>
