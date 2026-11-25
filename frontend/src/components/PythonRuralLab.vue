<script setup>
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps({
  initialMode: {
    type: String,
    default: 'cosecha', // 'cosecha' | 'inventario'
  },
});

const mode = ref(props.initialMode === 'inventario' ? 'inventario' : 'cosecha');
const announcement = ref('');

// ===========================================
// Proyecto 1: Calculadora de costos de cosecha
// ===========================================
const cosecha = reactive({
  cultivo: 'Café pergamino',
  kilos: 180,
  precioPorKilo: 14500,
  insumos: 620000,
  jornales: 950000,
});

const cosechaCalc = computed(() => {
  const kilos = Math.max(0, Number(cosecha.kilos) || 0);
  const precio = Math.max(0, Number(cosecha.precioPorKilo) || 0);
  const insumos = Math.max(0, Number(cosecha.insumos) || 0);
  const jornales = Math.max(0, Number(cosecha.jornales) || 0);

  const ingreso = kilos * precio;
  const costoTotal = insumos + jornales;
  const ganancia = ingreso - costoTotal;
  const margen = ingreso > 0 ? (ganancia / ingreso) * 100 : 0;

  let estado = 'SALUDABLE: Cosecha rentable';
  let tono = 'success';
  if (ganancia < 0) {
    estado = 'ALERTA: La cosecha genera pérdida';
    tono = 'error';
  } else if (margen < 20) {
    estado = 'PRECAUCIÓN: Margen ajustado (< 20%)';
    tono = 'warning';
  }

  return { ingreso, costoTotal, ganancia, margen, estado, tono };
});

const cosechaPythonCode = computed(() => `# costos_cosecha.py — Proyecto Ruta 3 VeredaCode
cultivo = "${cosecha.cultivo.replace(/"/g, "'")}"
kilos_cosechados = ${Number(cosecha.kilos) || 0}
precio_por_kilo = ${Number(cosecha.precioPorKilo) || 0}
costo_insumos = ${Number(cosecha.insumos) || 0}
costo_jornales = ${Number(cosecha.jornales) || 0}

ingreso_total = kilos_cosechados * precio_por_kilo
costo_total = costo_insumos + costo_jornales
ganancia_neta = ingreso_total - costo_total
margen = (ganancia_neta / ingreso_total) * 100 if ingreso_total > 0 else 0

if ganancia_neta < 0:
    estado = "ALERTA: La cosecha genera pérdida"
elif margen < 20:
    estado = "PRECAUCIÓN: Margen ajustado (< 20%)"
else:
    estado = "SALUDABLE: Cosecha rentable"

print(f"Cultivo: {cultivo}")
print(f"Ingreso total: \${ingreso_total:,}")
print(f"Costo total:   \${costo_total:,}")
print(f"Ganancia neta: \${ganancia_neta:,} ({margen:.1f}%)")
print(f"Diagnóstico:   {estado}")`);

// ===========================================
// Proyecto 2: Inventario Rural (Listas + Ciclos for)
// ===========================================
const inventario = ref([
  { producto: 'Bulto de abono', cantidad: 4, minimo: 5, precio: 125000 },
  { producto: 'Semilla de maíz (kg)', cantidad: 18, minimo: 10, precio: 12000 },
  { producto: 'Cajas de empaque', cantidad: 9, minimo: 15, precio: 4500 },
]);

const nuevoItem = reactive({
  producto: '',
  cantidad: 5,
  minimo: 6,
  precio: 10000,
});

function addInventoryItem() {
  const nombre = nuevoItem.producto.trim();
  if (!nombre) return;
  inventario.value.push({
    producto: nombre,
    cantidad: Math.max(0, Number(nuevoItem.cantidad) || 0),
    minimo: Math.max(0, Number(nuevoItem.minimo) || 0),
    precio: Math.max(0, Number(nuevoItem.precio) || 0),
  });
  nuevoItem.producto = '';
  announcement.value = `Producto "${nombre}" agregado al inventario y al código Python.`;
}

function removeInventoryItem(index) {
  const removed = inventario.value.splice(index, 1)[0];
  if (removed) {
    announcement.value = `Producto "${removed.producto}" eliminado del inventario.`;
  }
}

const inventarioCalc = computed(() => {
  let valorTotal = 0;
  const alertas = [];
  const lineas = inventario.value.map((item) => {
    const subtotal = item.cantidad * item.precio;
    valorTotal += subtotal;
    const reponer = item.cantidad < item.minimo;
    if (reponer) alertas.push(item.producto);
    return {
      ...item,
      subtotal,
      reponer,
    };
  });
  return { lineas, valorTotal, alertas };
});

const inventarioPythonCode = computed(() => {
  const rows = inventario.value
    .map(
      (i) =>
        `    {"producto": "${i.producto.replace(/"/g, "'")}", "cantidad": ${i.cantidad}, "minimo": ${i.minimo}, "precio": ${i.precio}},`
    )
    .join('\n');

  return `# inventario_vereda.py — Proyecto Ruta 3 VeredaCode
inventario = [
${rows}
]

valor_total = 0
por_reponer = []

for item in inventario:
    subtotal = item["cantidad"] * item["precio"]
    valor_total += subtotal
    if item["cantidad"] < item["minimo"]:
        por_reponer.append(item["producto"])
    print(f"- {item['producto']}: {item['cantidad']} uds (\${subtotal:,})")

print(f"\\nValor total del inventario: \${valor_total:,}")
print("Productos para reponer:", ", ".join(por_reponer) or "Ninguno")`;
});

function money(n) {
  return `$${Math.round(n).toLocaleString('es-CO')}`;
}

function downloadPython() {
  const isCosecha = mode.value === 'cosecha';
  const content = isCosecha ? cosechaPythonCode.value : inventarioPythonCode.value;
  const filename = isCosecha ? 'costos_cosecha.py' : 'inventario_vereda.py';
  const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  announcement.value = `Archivo ${filename} descargado listo para ejecutar en Python o subir a tu repositorio Git.`;
}

watch(
  () => props.initialMode,
  (val) => {
    mode.value = val === 'inventario' ? 'inventario' : 'cosecha';
  }
);
</script>

<template>
  <section class="card python-lab" aria-labelledby="python-lab-titulo">
    <div class="lab-header">
      <div>
        <p class="eyebrow">Laboratorio Ruta 3 · Python aplicado a tu entorno (Offline · 0 MB extra)</p>
        <h3 id="python-lab-titulo">Taller Interactivo de Python Rural</h3>
      </div>

      <div class="row" role="tablist" aria-label="Proyectos de Python">
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'cosecha'"
          :class="['btn', 'btn-sm', mode === 'cosecha' ? 'btn-primary' : 'btn-secondary']"
          @click="mode = 'cosecha'"
        >
          1. Costos de cosecha (Variables + if)
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'inventario'"
          :class="['btn', 'btn-sm', mode === 'inventario' ? 'btn-primary' : 'btn-secondary']"
          @click="mode = 'inventario'"
        >
          2. Inventario veredal (Listas + for)
        </button>
      </div>
    </div>

    <!-- MODO 1: COSECHA -->
    <div v-if="mode === 'cosecha'" class="py-grid">
      <div class="stack">
        <p class="muted">
          Modifica los datos reales de un cultivo y observa cómo cambian las variables, el condicional
          <code>if / elif / else</code> y la salida en consola.
        </p>

        <div class="form-grid">
          <label>
            <span>Cultivo</span>
            <input type="text" v-model="cosecha.cultivo" />
          </label>
          <label>
            <span>Kilos cosechados</span>
            <input type="number" min="0" v-model.number="cosecha.kilos" />
          </label>
          <label>
            <span>Precio venta / kilo (COP)</span>
            <input type="number" min="0" step="500" v-model.number="cosecha.precioPorKilo" />
          </label>
          <label>
            <span>Costo insumos (COP)</span>
            <input type="number" min="0" step="10000" v-model.number="cosecha.insumos" />
          </label>
          <label>
            <span>Costo jornales (COP)</span>
            <input type="number" min="0" step="10000" v-model.number="cosecha.jornales" />
          </label>
        </div>

        <div :class="['console-out', `tone-${cosechaCalc.tono}`]" role="status" aria-live="polite">
          <div class="console-title">Salida de consola Python</div>
          <pre>Cultivo: {{ cosecha.cultivo }}
Ingreso total: {{ money(cosechaCalc.ingreso) }}
Costo total:   {{ money(cosechaCalc.costoTotal) }}
Ganancia neta: {{ money(cosechaCalc.ganancia) }} ({{ cosechaCalc.margen.toFixed(1) }}%)
Diagnóstico:   {{ cosechaCalc.estado }}</pre>
        </div>
      </div>

      <div class="stack">
        <div class="code-panel">
          <div class="code-top">
            <span>costos_cosecha.py</span>
            <button type="button" class="btn btn-teal btn-sm" @click="downloadPython">
              Descargar .py
            </button>
          </div>
          <pre tabindex="0"><code>{{ cosechaPythonCode }}</code></pre>
        </div>
      </div>
    </div>

    <!-- MODO 2: INVENTARIO -->
    <div v-else class="py-grid">
      <div class="stack">
        <p class="muted">
          Agrega o quita artículos de tu finca o tienda escolar. El ciclo <code>for</code> recorre la
          lista automáticamente y marca alertas de reposición.
        </p>

        <form class="add-item-form" @submit.prevent="addInventoryItem">
          <label>
            <span>Producto</span>
            <input type="text" v-model="nuevoItem.producto" placeholder="Ej: Bulto de papa" required />
          </label>
          <label>
            <span>Cantidad</span>
            <input type="number" min="0" v-model.number="nuevoItem.cantidad" />
          </label>
          <label>
            <span>Mínimo</span>
            <input type="number" min="0" v-model.number="nuevoItem.minimo" />
          </label>
          <label>
            <span>Precio unit.</span>
            <input type="number" min="0" step="500" v-model.number="nuevoItem.precio" />
          </label>
          <button type="submit" class="btn btn-primary btn-sm">+ Agregar a lista</button>
        </form>

        <ul class="inv-list">
          <li v-for="(item, idx) in inventarioCalc.lineas" :key="`${item.producto}-${idx}`" class="inv-row">
            <div>
              <strong>{{ item.producto }}</strong>
              <span class="muted"> — {{ item.cantidad }} uds · {{ money(item.subtotal) }}</span>
              <span v-if="item.reponer" class="badge badge-amber" style="margin-left: 0.4rem">REPONER</span>
            </div>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :aria-label="`Eliminar ${item.producto}`"
              @click="removeInventoryItem(idx)"
            >
              Quitar
            </button>
          </li>
        </ul>

        <div class="console-out" role="status" aria-live="polite">
          <div class="console-title">Salida del ciclo for en consola Python</div>
          <pre><template v-for="(item, idx) in inventarioCalc.lineas" :key="idx">- {{ item.producto }}: {{ item.cantidad }} uds ({{ money(item.subtotal) }}){{ item.reponer ? ' [REPONER]' : '' }}
</template>
Valor total del inventario: {{ money(inventarioCalc.valorTotal) }}
Productos para reponer: {{ inventarioCalc.alertas.join(', ') || 'Ninguno' }}</pre>
        </div>
      </div>

      <div class="stack">
        <div class="code-panel">
          <div class="code-top">
            <span>inventario_vereda.py</span>
            <button type="button" class="btn btn-teal btn-sm" @click="downloadPython">
              Descargar .py
            </button>
          </div>
          <pre tabindex="0"><code>{{ inventarioPythonCode }}</code></pre>
        </div>
      </div>
    </div>

    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<style scoped>
.python-lab {
  border-color: var(--border-strong);
  margin: 1.5rem 0;
}

.lab-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.py-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 860px) {
  .py-grid {
    grid-template-columns: 1fr;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.form-grid label,
.add-item-form label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.add-item-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.6rem;
  align-items: end;
}

.inv-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.inv-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.console-out {
  background: var(--bg-code);
  border: 1px solid var(--border-strong);
  border-left: 4px solid var(--teal);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.console-out.tone-success {
  border-left-color: var(--success);
}

.console-out.tone-warning {
  border-left-color: var(--warning);
}

.console-out.tone-error {
  border-left-color: var(--danger);
}

.console-title {
  background: var(--bg-elevated);
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  border-bottom: 1px solid var(--border);
}

.console-out pre {
  margin: 0;
  padding: 0.85rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.86rem;
  line-height: 1.5;
  color: #edf2f7;
}

.code-panel {
  background: var(--bg-code);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.code-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.85rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--accent);
}

.code-panel pre {
  margin: 0;
  padding: 0.95rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.83rem;
  line-height: 1.5;
  color: #edf2f7;
}
</style>
