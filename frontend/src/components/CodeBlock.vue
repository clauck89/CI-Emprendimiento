<script setup>
import { ref } from 'vue';

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'text' },
  filename: { type: String, default: '' },
});

const copied = ref(false);
const statusMessage = ref('');

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    statusMessage.value = 'Código copiado al portapapeles.';
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    statusMessage.value = 'No se pudo copiar automáticamente; selecciona el código manualmente.';
  }
}

function downloadCode() {
  const extMap = {
    html: 'html',
    css: 'css',
    javascript: 'js',
    python: 'py',
    text: 'txt',
  };
  const ext = extMap[props.language] || 'txt';
  const name = props.filename || `veredacode-ejemplo.${ext}`;
  const blob = new Blob([props.code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  statusMessage.value = `Archivo ${name} descargado.`;
}
</script>

<template>
  <div class="code-box">
    <div class="code-header">
      <span class="code-lang">{{ language.toUpperCase() }}</span>
      <div class="row">
        <button type="button" class="btn btn-secondary btn-sm" @click="copyCode">
          {{ copied ? 'Copiado' : 'Copiar código' }}
        </button>
        <button type="button" class="btn btn-secondary btn-sm" @click="downloadCode">
          Descargar
        </button>
      </div>
    </div>
    <pre class="code-pre" tabindex="0"><code>{{ code }}</code></pre>
    <p class="sr-only" aria-live="polite">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.code-box {
  background: var(--bg-code);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 1rem 0;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
}

.code-lang {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
}

.code-pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.55;
  color: #edf2f7;
}
</style>
