<script setup>
import { ref, onMounted } from 'vue';
import { checkCmsHealth } from '../services/cmsApi.js';
import { curriculumState, getSourceLabel, loadCurriculum } from '../stores/curriculum.js';
import { exportProgressJson, importProgressJson } from '../stores/progress.js';

const cmsStatus = ref({ checking: true, ok: false });
const backupMessage = ref('');

async function verifyCms() {
  cmsStatus.value = { checking: true, ok: false };
  const result = await checkCmsHealth();
  cmsStatus.value = { checking: false, ...result };
}

function handleExport() {
  const json = exportProgressJson();
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'veredacode-progreso.json';
  a.click();
  URL.revokeObjectURL(url);
  backupMessage.value = 'Respaldo veredacode-progreso.json descargado correctamente.';
}

async function handleImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const total = importProgressJson(text);
    backupMessage.value = `Progreso restaurado con éxito (${total} módulos completados guardados).`;
  } catch (err) {
    backupMessage.value = `No se pudo importar el archivo: ${err.message}`;
  } finally {
    event.target.value = '';
  }
}

onMounted(() => {
  verifyCms();
});
</script>

<template>
  <div class="container page-pad">
    <p class="eyebrow">Proyecto de Base Tecnológica · ODS 4: Educación de Calidad</p>
    <h1>Arquitectura, Accesibilidad y Estado Técnico</h1>
    <p class="muted" style="max-width: 72ch">
      VeredaCode cierra brechas digitales en municipios y zonas periféricas mediante una
      Aplicación Web Progresiva (PWA) liviana, accesible (WCAG 2.1 AA) y respaldada por una
      arquitectura desacoplada en contenedores Docker.
    </p>

    <div class="grid-2" style="margin-top: 1.5rem">
      <section class="card">
        <h2>Estado del Headless WordPress CMS</h2>
        <p class="muted">Fuente actual del currículo: <strong>{{ getSourceLabel(curriculumState.source) }}</strong></p>

        <div class="status-box" role="status" aria-live="polite">
          <template v-if="cmsStatus.checking">Verificando conexión con <code>/wp-json/veredacode/v1/health</code>...</template>
          <template v-else-if="cmsStatus.ok">
            <strong style="color: var(--success)">● API REST activa</strong> —
            {{ cmsStatus.cursos }} rutas y {{ cmsStatus.modulos }} módulos publicados en MySQL.
          </template>
          <template v-else>
            <strong style="color: var(--warning)">● Modo autónomo / offline</strong> —
            La PWA está operando con su currículo integrado sin interrumpir el estudio. Cuando
            levantes Docker y cargues las rutas en <code>/wp-admin</code>, la sincronización será automática.
          </template>
        </div>

        <div class="row" style="margin-top: 1rem">
          <button type="button" class="btn btn-secondary btn-sm" @click="verifyCms">
            Probar API REST
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="loadCurriculum({ force: true })">
            Recargar catálogo
          </button>
          <a href="/wp-admin/" class="btn btn-teal btn-sm">Panel docente (/wp-admin)</a>
        </div>
      </section>

      <section class="card">
        <h2>Respaldo de progreso (equipos compartidos)</h2>
        <p class="muted">
          Si estudias desde el computador del colegio o biblioteca, puedes descargar tu avance en un
          archivo liviano (menos de 1 KB) y cargarlo después en otro equipo.
        </p>
        <div class="row" style="margin-top: 0.75rem">
          <button type="button" class="btn btn-primary btn-sm" @click="handleExport">
            Exportar progreso (.json)
          </button>
          <label class="btn btn-secondary btn-sm file-btn">
            Importar progreso (.json)
            <input type="file" accept="application/json" class="sr-only" @change="handleImport" />
          </label>
        </div>
        <p v-if="backupMessage" class="muted" role="status" aria-live="polite" style="margin-top: 0.75rem">
          {{ backupMessage }}
        </p>
      </section>
    </div>

    <div class="grid-2" style="margin-top: 1.25rem">
      <section class="card">
        <h2>Cumplimiento WCAG 2.1 AA</h2>
        <ul class="check-list">
          <li>Enlace "Saltar al contenido principal" y foco visible de alto contraste en toda la interfaz.</li>
          <li>Paleta oscura con relación de contraste superior a 12:1 + modo de alto contraste AAA.</li>
          <li>Navegación completa por teclado (<code>Tab</code>, <code>Shift+Tab</code>, <code>Enter</code>).</li>
          <li>Ajuste de escala de texto (90% a 130%) y reducción de animaciones persistente.</li>
          <li>Etiquetas semánticas HTML5, regiones ARIA y anuncios <code>aria-live</code> en laboratorios.</li>
        </ul>
      </section>

      <section class="card">
        <h2>Optimización para baja conectividad</h2>
        <ul class="check-list">
          <li>Cero videos pesados y cero fuentes externas bloqueantes: tipografía del sistema instantánea.</li>
          <li>Service Worker (Workbox PWA) que cachea la aplicación y las respuestas JSON de WordPress.</li>
          <li>Compresión Gzip y cabeceras inmutables en Nginx para minimizar consumo de datos móviles.</li>
          <li>Laboratorios interactivos (Bloques, HTML/CSS/JS y Python Rural) 100% en cliente sin backend extra.</li>
          <li>Integración Continua con GitHub Actions verificando build, pruebas, presupuesto de peso y Docker.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-pad {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.status-box {
  background: var(--bg-code);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
}

.file-btn {
  cursor: pointer;
}

.check-list {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: var(--text-muted);
}
</style>
