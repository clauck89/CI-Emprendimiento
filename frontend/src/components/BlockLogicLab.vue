<script setup>
import { ref, computed } from 'vue';

const levels = [
  {
    id: 1,
    nombre: 'Nivel 1 · Camino en L',
    size: 5,
    start: { x: 0, y: 0, dir: 1 }, // 0=N, 1=E, 2=S, 3=O
    goal: { x: 2, y: 2 },
    rocks: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    pista: 'Avanza 2 veces hacia la derecha, gira a la derecha, avanza 2 veces y recoge la semilla.',
  },
  {
    id: 2,
    nombre: 'Nivel 2 · Esquivar las rocas',
    size: 5,
    start: { x: 0, y: 4, dir: 0 },
    goal: { x: 4, y: 1 },
    rocks: [
      { x: 0, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
    ],
    pista: 'Sube 1 casilla, gira a la derecha, rodea las rocas del centro y llega a la semilla.',
  },
];

const dirLabels = ['Norte (↑)', 'Este (→)', 'Sur (↓)', 'Oeste (←)'];
const dirArrows = ['↑', '→', '↓', '←'];
const dirVectors = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

const levelIndex = ref(0);
const currentLevel = computed(() => levels[levelIndex.value]);

const program = ref(['AVANZAR', 'AVANZAR', 'DERECHA', 'AVANZAR', 'AVANZAR', 'RECOGER']);
const robot = ref({ ...levels[0].start });
const collected = ref(false);
const running = ref(false);
const activeStep = ref(-1);
const feedback = ref('Agrega bloques y pulsa "Ejecutar algoritmo" para probar tu solución.');
const feedbackType = ref('info');

const blockMeta = {
  AVANZAR: { label: 'Avanzar 1 casilla', color: 'teal' },
  DERECHA: { label: 'Girar derecha (90°)', color: 'amber' },
  IZQUIERDA: { label: 'Girar izquierda (90°)', color: 'amber' },
  RECOGER: { label: 'Recoger semilla', color: 'green' },
};

function isRock(x, y) {
  return currentLevel.value.rocks.some((r) => r.x === x && r.y === y);
}

function selectLevel(idx) {
  levelIndex.value = idx;
  resetRobot();
  program.value = idx === 0 ? ['AVANZAR', 'AVANZAR', 'DERECHA', 'AVANZAR', 'AVANZAR', 'RECOGER'] : [];
  feedback.value = `Cargado ${levels[idx].nombre}. ${levels[idx].pista}`;
  feedbackType.value = 'info';
}

function addBlock(cmd) {
  if (program.value.length >= 20) {
    feedback.value = 'Límite de 20 bloques alcanzado. Intenta optimizar tu algoritmo.';
    feedbackType.value = 'warning';
    return;
  }
  program.value.push(cmd);
}

function removeBlock(idx) {
  program.value.splice(idx, 1);
}

function clearProgram() {
  program.value = [];
  resetRobot();
  feedback.value = 'Secuencia vaciada. Agrega bloques para construir un nuevo algoritmo.';
  feedbackType.value = 'info';
}

function resetRobot() {
  robot.value = { ...currentLevel.value.start };
  collected.value = false;
  activeStep.value = -1;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runProgram() {
  if (running.value) return;
  if (program.value.length === 0) {
    feedback.value = 'Tu algoritmo está vacío. Añade al menos un bloque.';
    feedbackType.value = 'warning';
    return;
  }

  resetRobot();
  running.value = true;
  feedback.value = 'Ejecutando algoritmo paso a paso...';
  feedbackType.value = 'info';

  for (let i = 0; i < program.value.length; i += 1) {
    activeStep.value = i;
    const cmd = program.value[i];
    await wait(240);

    if (cmd === 'DERECHA') {
      robot.value.dir = (robot.value.dir + 1) % 4;
    } else if (cmd === 'IZQUIERDA') {
      robot.value.dir = (robot.value.dir + 3) % 4;
    } else if (cmd === 'AVANZAR') {
      const vec = dirVectors[robot.value.dir];
      const nx = robot.value.x + vec.dx;
      const ny = robot.value.y + vec.dy;

      if (nx < 0 || ny < 0 || nx >= currentLevel.value.size || ny >= currentLevel.value.size) {
        feedback.value = `Paso ${i + 1}: El robot salió del borde de la parcela. Corrige el giro o los pasos.`;
        feedbackType.value = 'error';
        running.value = false;
        return;
      }
      if (isRock(nx, ny)) {
        feedback.value = `Paso ${i + 1}: ¡Hay una roca en (${nx + 1}, ${ny + 1})! Depura tu ruta para rodearla.`;
        feedbackType.value = 'error';
        running.value = false;
        return;
      }
      robot.value.x = nx;
      robot.value.y = ny;
    } else if (cmd === 'RECOGER') {
      if (robot.value.x === currentLevel.value.goal.x && robot.value.y === currentLevel.value.goal.y) {
        collected.value = true;
        feedback.value = `¡Excelente! Algoritmo correcto en ${program.value.length} bloques. Recogiste la semilla.`;
        feedbackType.value = 'success';
        running.value = false;
        return;
      }
      feedback.value = `Paso ${i + 1}: Usaste "Recoger semilla", pero aún no estás sobre la semilla.`;
      feedbackType.value = 'warning';
      running.value = false;
      return;
    }
  }

  running.value = false;
  if (!collected.value) {
    feedback.value = 'El algoritmo terminó sin recoger la semilla. Añade más pasos o el bloque "Recoger semilla".';
    feedbackType.value = 'warning';
  }
}
</script>

<template>
  <section class="card lab-panel" aria-labelledby="lab-bloques-titulo">
    <div class="lab-top">
      <div>
        <p class="eyebrow">Laboratorio Ruta 1 · Pensamiento Computacional</p>
        <h3 id="lab-bloques-titulo">Algoritmos por bloques: Robot Recolector</h3>
      </div>
      <div class="row">
        <button
          v-for="(lvl, idx) in levels"
          :key="lvl.id"
          type="button"
          :class="['btn', 'btn-sm', idx === levelIndex ? 'btn-primary' : 'btn-secondary']"
          @click="selectLevel(idx)"
        >
          {{ lvl.nombre }}
        </button>
      </div>
    </div>

    <p class="muted">{{ currentLevel.pista }}</p>

    <div class="bloques-layout">
      <!-- Cuadrícula accesible -->
      <div class="grid-wrapper">
        <div
          class="parcela"
          role="grid"
          :aria-label="`Parcela de ${currentLevel.size} por ${currentLevel.size}. Robot en columna ${robot.x + 1}, fila ${robot.y + 1}, mirando al ${dirLabels[robot.dir]}`"
        >
          <template v-for="y in currentLevel.size" :key="y">
            <div
              v-for="x in currentLevel.size"
              :key="`${x}-${y}`"
              :class="[
                'cell',
                {
                  'is-rock': isRock(x - 1, y - 1),
                  'is-goal': currentLevel.goal.x === x - 1 && currentLevel.goal.y === y - 1,
                  'is-robot': robot.x === x - 1 && robot.y === y - 1,
                },
              ]"
            >
              <span v-if="robot.x === x - 1 && robot.y === y - 1" class="robot-token" :title="dirLabels[robot.dir]">
                {{ dirArrows[robot.dir] }}
              </span>
              <span
                v-else-if="currentLevel.goal.x === x - 1 && currentLevel.goal.y === y - 1 && !collected"
                class="goal-token"
                title="Semilla objetivo"
              >
                ★
              </span>
              <span v-else-if="isRock(x - 1, y - 1)" class="rock-token" title="Roca (obstáculo)">
                ■
              </span>
            </div>
          </template>
        </div>
        <p class="legend muted">
          <strong>{{ dirArrows[robot.dir] }}</strong> Robot ({{ dirLabels[robot.dir] }}) ·
          <strong>★</strong> Semilla · <strong>■</strong> Roca
        </p>
      </div>

      <!-- Constructor de bloques -->
      <div class="builder">
        <h4>1. Añadir instrucciones</h4>
        <div class="row">
          <button
            v-for="(meta, cmd) in blockMeta"
            :key="cmd"
            type="button"
            class="btn btn-secondary btn-sm"
            :disabled="running"
            @click="addBlock(cmd)"
          >
            + {{ meta.label }}
          </button>
        </div>

        <h4 class="seq-title">2. Tu secuencia ({{ program.length }} bloques)</h4>
        <ol v-if="program.length" class="block-list">
          <li
            v-for="(cmd, idx) in program"
            :key="`${cmd}-${idx}`"
            :class="['block-item', `tone-${blockMeta[cmd].color}`, { active: activeStep === idx }]"
          >
            <span>{{ idx + 1 }}. {{ blockMeta[cmd].label }}</span>
            <button
              type="button"
              class="remove-btn"
              :disabled="running"
              :aria-label="`Quitar paso ${idx + 1}: ${blockMeta[cmd].label}`"
              @click="removeBlock(idx)"
            >
              ✕
            </button>
          </li>
        </ol>
        <p v-else class="muted">Aún no hay bloques. Pulsa los botones de arriba para armar tu algoritmo.</p>

        <div class="row" style="margin-top: 1rem">
          <button type="button" class="btn btn-primary" :disabled="running" @click="runProgram">
            {{ running ? 'Ejecutando...' : 'Ejecutar algoritmo' }}
          </button>
          <button type="button" class="btn btn-secondary" :disabled="running" @click="resetRobot">
            Volver al inicio
          </button>
          <button type="button" class="btn btn-secondary" :disabled="running" @click="clearProgram">
            Limpiar todo
          </button>
        </div>
      </div>
    </div>

    <div :class="['feedback-box', `fb-${feedbackType}`]" role="status" aria-live="polite">
      {{ feedback }}
    </div>
  </section>
</template>

<style scoped>
.lab-panel {
  border-color: var(--border-strong);
  margin: 1.5rem 0;
}

.lab-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.bloques-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .bloques-layout {
    grid-template-columns: 1fr;
  }
}

.parcela {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  background: var(--bg-code);
  padding: 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
}

.cell {
  aspect-ratio: 1;
  background: #14202b;
  border: 1px solid #233344;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
}

.cell.is-rock {
  background: #272f38;
  color: #8a99a8;
}

.cell.is-goal {
  background: rgba(47, 168, 144, 0.25);
  border-color: var(--teal);
  color: #7ee8d4;
}

.cell.is-robot {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: #ffffff;
}

.legend {
  font-size: 0.82rem;
  margin-top: 0.6rem;
}

.seq-title {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.block-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: 220px;
  overflow-y: auto;
}

.block-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  background: var(--bg-elevated);
  border-left: 4px solid var(--teal);
  font-size: 0.9rem;
}

.block-item.tone-amber {
  border-left-color: var(--accent);
}

.block-item.tone-green {
  border-left-color: var(--success);
}

.block-item.active {
  outline: 2px solid var(--focus);
  background: #243446;
}

.remove-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 4px;
  padding: 0.15rem 0.45rem;
  cursor: pointer;
}

.remove-btn:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.feedback-box {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  font-weight: 600;
}

.fb-success {
  border-color: var(--success);
  color: #bbf7d0;
}

.fb-error {
  border-color: var(--danger);
  color: #fecaca;
}

.fb-warning {
  border-color: var(--warning);
  color: #fde68a;
}
</style>
