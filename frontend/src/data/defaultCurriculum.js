/**
 * Currículo base incluido en la PWA de VeredaCode.
 * Garantiza funcionamiento 100% offline e inmediato mientras Headless WordPress
 * entrega actualizaciones dinámicas vía /wp-json/veredacode/v1/rutas.
 */

export const defaultCurriculum = [
  {
    id: 101,
    slug: 'alfabetizacion-digital-pensamiento-computacional',
    rutaNumero: 1,
    titulo: 'Alfabetización digital y pensamiento computacional',
    descripcion:
      'Puerta de entrada práctica para estudiantes que nunca han programado y para docentes: dominio del computador y el celular, uso seguro de internet, lógica y algoritmos en papel y por bloques.',
    nivel: 'Ruta 1 · Inicial',
    etiqueta: 'Puerta de entrada',
    duracion: '3 horas',
    pesoKb: 38,
    requisitos: 'Ninguno. Diseñada para empezar desde cero, incluso sin internet constante.',
    tipoPractica: 'bloques',
    repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
    objetivos: [
      'Usar el computador y el celular como herramientas reales de estudio y organización.',
      'Navegar con seguridad evitando engaños (phishing) y protegiendo tus cuentas en equipos compartidos.',
      'Pensar paso a paso con algoritmos en papel y resolver retos en el laboratorio de bloques.',
    ],
    modulos: [
      {
        id: 1001,
        slug: 'computador-y-celular-para-estudiar',
        titulo: 'El computador y el celular como herramientas de estudio',
        orden: 1,
        duracionMin: 25,
        resumen:
          'Organización de archivos y carpetas, atajos clave de teclado y cómo estudiar en modo sin conexión.',
        objetivo:
          'Organizar tus proyectos de aprendizaje localmente y navegar VeredaCode usando solo teclado.',
        contenidoHtml: `
          <p>No necesitas un computador costoso ni fibra óptica para iniciar en tecnología. Tanto un computador escolar compartido como un celular básico sirven para aprender programación cuando organizas bien tus archivos y usas herramientas livianas.</p>
          <h3>1. Nombra tus carpetas como programador</h3>
          <p>Evita espacios, tildes y símbolos raros en los nombres de tus archivos de código. Usa guiones medios o guiones bajos, por ejemplo: <code>mi_huerta_web</code> o <code>costos-cosecha.py</code>.</p>
          <h3>2. Atajos de teclado que ahorran tiempo y mejoran la accesibilidad</h3>
          <ul>
            <li><strong>Tab / Shift + Tab:</strong> muévete hacia adelante o atrás entre botones y enlaces sin usar mouse.</li>
            <li><strong>Enter o Espacio:</strong> activa el botón seleccionado.</li>
            <li><strong>Ctrl + C / Ctrl + V:</strong> copia y pega bloques de código sin errores de escritura.</li>
            <li><strong>Ctrl + Z:</strong> deshace el último cambio si borraste algo por accidente.</li>
          </ul>
          <h3>3. Ahorra datos en tu celular o aula</h3>
          <p>VeredaCode guarda sus lecciones en el navegador (PWA). Una vez cargada esta página, puedes desconectar los datos móviles y continuar leyendo y practicando en el laboratorio.</p>
        `,
        codigoEjemplo: `veredacode-practicas/
├── ruta-1-logica/
│   └── algoritmo-diario.txt
├── ruta-2-mi-web/
│   ├── index.html
│   └── estilos.css
└── ruta-3-python/
    ├── costos_cosecha.py
    └── inventario_vereda.py`,
        lenguajeCodigo: 'text',
        tipoLaboratorio: 'none',
        ejercicioPapel:
          'En tu cuaderno, dibuja el árbol de carpetas donde guardarás tus prácticas de las 3 rutas y practica navegar esta pantalla usando únicamente la tecla Tab y Enter.',
        repoUrl: '',
      },
      {
        id: 1002,
        slug: 'uso-seguro-de-internet',
        titulo: 'Uso seguro de internet y ciudadanía digital',
        orden: 2,
        duracionMin: 25,
        resumen:
          'Reglas prácticas para crear contraseñas seguras, detectar enlaces falsos y cuidar tu privacidad.',
        objetivo:
          'Identificar señales de phishing y proteger cuentas personales en dispositivos compartidos.',
        contenidoHtml: `
          <p>En colegios, bibliotecas y centros digitales es habitual compartir equipos o redes Wi-Fi. Cuidar tu seguridad digital te protege a ti y a tu comunidad.</p>
          <h3>Reglas prácticas de seguridad</h3>
          <ul>
            <li><strong>Usa frases, no fechas:</strong> Una contraseña como <code>MontañaVerde#2026</code> es mucho más segura y fácil de recordar que tu fecha de cumpleaños.</li>
            <li><strong>Desconfía de mensajes urgentes:</strong> Si recibes un enlace prometiendo premios o pidiendo códigos por SMS/WhatsApp, no ingreses tus datos.</li>
            <li><strong>Cierra sesión siempre:</strong> En computadores de la escuela o café internet, cierra tu sesión al terminar y usa ventana privada si es posible.</li>
            <li><strong>Verifica antes de compartir:</strong> Contrasta cadenas de mensajes con fuentes oficiales antes de reenviarlas.</li>
          </ul>
        `,
        codigoEjemplo: `LISTA DE CHEQUEO DE SEGURIDAD DIGITAL
-------------------------------------
[x] Contraseña de al menos 12 caracteres (frase + número + símbolo)
[x] Nunca compartir códigos de verificación por chat o llamada
[x] Revisar la dirección web exacta antes de escribir una clave
[x] Cerrar sesión al terminar en computadores compartidos`,
        lenguajeCodigo: 'text',
        tipoLaboratorio: 'none',
        ejercicioPapel:
          'Inventa una regla personal (sin escribir tu contraseña real) para crear frases seguras inspiradas en un lugar, un cultivo o una comida típica de tu municipio.',
        repoUrl: '',
      },
      {
        id: 1003,
        slug: 'logica-y-algoritmos-por-bloques',
        titulo: 'Lógica y algoritmos: en papel y por bloques',
        orden: 3,
        duracionMin: 35,
        resumen:
          'Descomposición de problemas en instrucciones exactas, depuración de errores y laboratorio visual por bloques.',
        objetivo:
          'Construir y probar un algoritmo paso a paso para resolver un recorrido con obstáculos.',
        contenidoHtml: `
          <p>Un <strong>algoritmo</strong> es una secuencia ordenada y clara de pasos para lograr una meta. Cuando una computadora ejecuta código, sigue tus instrucciones al pie de la letra: ni más, ni menos.</p>
          <h3>Tres habilidades del pensamiento computacional</h3>
          <ol>
            <li><strong>Descomponer:</strong> dividir un problema grande en pasos pequeños y manejables.</li>
            <li><strong>Detectar patrones:</strong> notar qué acciones se repiten (por ejemplo, avanzar varias veces).</li>
            <li><strong>Depurar:</strong> probar tu solución, observar dónde falló y corregir ese paso sin frustración.</li>
          </ol>
          <p>Usa el <strong>Laboratorio de Bloques</strong> de abajo para guiar al robot recolector hasta la semilla sorteando las rocas de la parcela.</p>
        `,
        codigoEjemplo: `ALGORITMO: Recolectar semilla en la parcela
INICIO
  1. Avanzar
  2. Avanzar
  3. Girar a la derecha
  4. Avanzar
  5. Avanzar
  6. Recoger semilla
FIN`,
        lenguajeCodigo: 'text',
        tipoLaboratorio: 'bloques',
        ejercicioPapel:
          'Actividad desconectada: escribe en papel instrucciones exactas para ir de la puerta del salón al tablero. Pídele a un compañero que actúe como "robot" siguiendo literalmente tus pasos.',
        repoUrl: '',
      },
    ],
  },
  {
    id: 102,
    slug: 'desarrollo-web-desde-cero',
    rutaNumero: 2,
    titulo: 'Desarrollo web desde cero (HTML, CSS y JavaScript)',
    descripcion:
      'Curso inicial del piloto VeredaCode. Practica directamente en el navegador sin instalar programas y termina con tu propia página web accesible, liviana y descargable.',
    nivel: 'Ruta 2 · Piloto Inicial',
    etiqueta: 'Ideal para iniciar el piloto',
    duracion: '5 horas',
    pesoKb: 52,
    requisitos: 'Manejo básico de teclado y navegador (Ruta 1 recomendada).',
    tipoPractica: 'web-sandbox',
    repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
    objetivos: [
      'Construir la estructura de una página web con HTML semántico y accesible (WCAG).',
      'Aplicar diseño visual limpio, modo oscuro y adaptación a celulares con CSS.',
      'Agregar interactividad con JavaScript y descargar tu propia página web lista para compartir.',
    ],
    modulos: [
      {
        id: 2001,
        slug: 'html-semantico-y-accesible',
        titulo: 'Estructura con HTML semántico y accesible',
        orden: 1,
        duracionMin: 35,
        resumen:
          'Aprende las etiquetas fundamentales de HTML para crear páginas rápidas, ordenadas y comprensibles.',
        objetivo:
          'Estructurar una página comunitaria usando header, main, section, encabezados y listas.',
        contenidoHtml: `
          <p><strong>HTML</strong> (Lenguaje de Marcado de Hipertexto) define el significado y el orden del contenido en la web. Esta misma plataforma VeredaCode está hecha sobre HTML, CSS y JavaScript.</p>
          <h3>¿Por qué usar HTML semántico?</h3>
          <ul>
            <li>Usa <code>&lt;h1&gt;</code> solo para el título principal y <code>&lt;h2&gt;</code> para cada sección.</li>
            <li>Separa el contenido con <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code> y <code>&lt;footer&gt;</code>.</li>
            <li>Una página semántica pesa pocos kilobytes y funciona muy bien con lectores de pantalla.</li>
          </ul>
          <p><strong>Tu reto en el laboratorio:</strong> cambia el nombre de la huerta por el nombre de tu colegio, vereda o emprendimiento, y agrega un cuarto producto a la lista.</p>
        `,
        codigoEjemplo: `<header>
  <h1>Huerta Escolar La Esperanza</h1>
  <p>Alimentos sanos sembrados por estudiantes de la vereda.</p>
</header>

<main>
  <section class="tarjeta">
    <h2>Cosecha disponible esta semana</h2>
    <ul>
      <li>Lechuga orgánica — $3.000</li>
      <li>Cilantro fresco — $1.500</li>
      <li>Tomate chonto (libra) — $2.800</li>
    </ul>
  </section>
</main>`,
        lenguajeCodigo: 'html',
        tipoLaboratorio: 'web-sandbox',
        labPreset: 'html-basico',
        ejercicioPapel:
          'Boceta en tu cuaderno la página web que quieres crear al final de esta ruta: título, breve historia de tu proyecto, lista de servicios o productos y cómo contactarte.',
        repoUrl: '',
      },
      {
        id: 2002,
        slug: 'css-modo-oscuro-y-diseno-adaptable',
        titulo: 'Diseño visual con CSS, contraste y modo oscuro',
        orden: 2,
        duracionMin: 40,
        resumen:
          'Estilos accesibles de alto contraste, tarjetas ordenadas con Flexbox y diseño pensado para celulares.',
        objetivo:
          'Dar estilo en modo oscuro a tu página cuidando la legibilidad y el espaciado en pantallas pequeñas.',
        contenidoHtml: `
          <p>Con <strong>CSS</strong> controlamos colores, tamaños de letra y distribución en pantalla sin cargar imágenes pesadas.</p>
          <h3>Claves de diseño accesible (WCAG)</h3>
          <ul>
            <li><strong>Alto contraste:</strong> texto claro (<code>#f4f1ea</code>) sobre fondo oscuro profundo (<code>#0f1720</code>) descansa la vista y es fácil de leer.</li>
            <li><strong>Tamaño legible:</strong> usa al menos <code>16px</code> (<code>1rem</code>) para el texto base y buen espacio entre líneas (<code>line-height: 1.6</code>).</li>
            <li><strong>Tarjetas flexibles:</strong> con <code>display: flex</code> y <code>flex-wrap: wrap</code> tu diseño se acomoda solo en celular y en computador.</li>
          </ul>
          <p><strong>Tu reto:</strong> en la pestaña CSS del laboratorio, cambia el color del borde izquierdo (<code>#e59a3c</code>) por verde esmeralda (<code>#2fa890</code>) y prueba cambiar el tamaño del título.</p>
        `,
        codigoEjemplo: `body {
  background: #0f1720;
  color: #f4f1ea;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  padding: 1.25rem;
}

.cuadricula {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tarjeta {
  flex: 1 1 200px;
  background: #18232f;
  border: 1px solid #2b3c4f;
  border-left: 4px solid #e59a3c;
  border-radius: 10px;
  padding: 1rem;
}`,
        lenguajeCodigo: 'css',
        tipoLaboratorio: 'web-sandbox',
        labPreset: 'css-tarjetas',
        ejercicioPapel:
          'Compara una pantalla con fondo claro brillante y una en modo oscuro. Anota qué colores te permiten leer más tiempo sin cansancio visual.',
        repoUrl: '',
      },
      {
        id: 2003,
        slug: 'javascript-basico-tu-pagina-propia',
        titulo: 'JavaScript básico y descarga de tu propia página web',
        orden: 3,
        duracionMin: 45,
        resumen:
          'Eventos, actualización dinámica del contenido y exportación de tu proyecto final como archivo HTML propio.',
        objetivo:
          'Programar un botón interactivo y descargar tu propia página web completa para abrirla en cualquier equipo sin internet.',
        contenidoHtml: `
          <p><strong>JavaScript</strong> agrega interactividad inmediata dentro del navegador: sumar pedidos, mostrar mensajes o guardar datos sin recargar la página.</p>
          <h3>Proyecto final de la Ruta 2</h3>
          <p>En el laboratorio interactivo de abajo ya tienes una página completa para un emprendimiento o proyecto local con contador interactivo de pedidos. Personaliza el texto, los precios y los colores, prueba el botón <strong>Ejecutar</strong> y luego pulsa <strong>Descargar mi página (.html)</strong>.</p>
          <p>Ese archivo <code>mi-pagina-veredacode.html</code> es 100% tuyo: puedes abrirlo en cualquier computador o celular sin conexión a internet.</p>
        `,
        codigoEjemplo: `const boton = document.getElementById('btn-pedido');
const salida = document.getElementById('resumen-pedido');
let bolsas = 0;
const precioBolsa = 12000;

boton.addEventListener('click', () => {
  bolsas += 1;
  const total = bolsas * precioBolsa;
  salida.textContent =
    \`Pedido actual: \${bolsas} bolsa(s) — Total: $\${total.toLocaleString('es-CO')}\`;
});`,
        lenguajeCodigo: 'javascript',
        tipoLaboratorio: 'web-sandbox',
        labPreset: 'proyecto-final',
        ejercicioPapel:
          'Piensa qué nueva función te gustaría agregarle a tu página web la próxima semana (por ejemplo: un botón para reiniciar el pedido o una lista de horarios de entrega).',
        repoUrl: '',
      },
    ],
  },
  {
    id: 103,
    slug: 'introduccion-programacion-python',
    rutaNumero: 3,
    titulo: 'Introducción a la programación con Python',
    descripcion:
      'Para quienes ya dominan la lógica básica: variables, condicionales, ciclos y proyectos útiles para tu entorno como calcular costos de una cosecha o llevar un inventario rural.',
    nivel: 'Ruta 3 · Práctico',
    etiqueta: 'Laboratorios y repositorios de código',
    duracion: '6 horas',
    pesoKb: 58,
    requisitos: 'Haber completado la Ruta 1 o conocer lógica básica de algoritmos.',
    tipoPractica: 'python-rural',
    repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
    objetivos: [
      'Usar variables y operaciones matemáticas en Python para calcular costos y ganancias de una cosecha.',
      'Aplicar condicionales (if / elif / else) para evaluar rentabilidad y emitir alertas automáticas.',
      'Automatizar un inventario local con listas, diccionarios y ciclos for listos para subir a un repositorio Git.',
    ],
    modulos: [
      {
        id: 3001,
        slug: 'variables-y-costos-de-cosecha',
        titulo: 'Variables y cálculo de costos de una cosecha',
        orden: 1,
        duracionMin: 40,
        resumen:
          'Usa variables numéricas y de texto en Python para modelar insumos, jornales, ingresos y utilidad real.',
        objetivo:
          'Comprender cómo las variables y fórmulas en Python resuelven cálculos financieros de una finca.',
        contenidoHtml: `
          <p><strong>Python</strong> es uno de los lenguajes más claros para aprender a programar porque se lee casi como el español o el inglés cotidiano.</p>
          <h3>Variables con sentido real</h3>
          <p>En lugar de usar nombres confusos como <code>x</code> o <code>y</code>, llamamos a cada dato por lo que representa: <code>kilos_cosechados</code>, <code>precio_por_kilo</code>, <code>costo_insumos</code> y <code>costo_jornales</code>.</p>
          <p>En el <strong>Taller Interactivo de Python</strong> de abajo, cambia los valores de una cosecha de café, papa o plátano y observa paso a paso cómo se ejecuta cada línea del código Python equivalente.</p>
        `,
        codigoEjemplo: `# Proyecto 1: Calculadora de costos de cosecha (VeredaCode)
cultivo = "Café pergamino"
kilos_cosechados = 180
precio_por_kilo = 14500
costo_insumos = 620000
costo_jornales = 950000

ingreso_total = kilos_cosechados * precio_por_kilo
costo_total = costo_insumos + costo_jornales
ganancia_neta = ingreso_total - costo_total

print(f"Cultivo: {cultivo}")
print(f"Ingreso total: \${ingreso_total:,}")
print(f"Costo total:   \${costo_total:,}")
print(f"Ganancia neta: \${ganancia_neta:,}")`,
        lenguajeCodigo: 'python',
        tipoLaboratorio: 'python-cosecha',
        ejercicioPapel:
          'Pregunta en tu casa o comunidad cuánto cuesta producir un bulto de papa, carga de café o racimo de plátano, y anota esos datos para probarlos en el simulador.',
        repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
      },
      {
        id: 3002,
        slug: 'condicionales-y-alertas-de-decision',
        titulo: 'Condicionales (if / elif / else) para tomar decisiones',
        orden: 2,
        duracionMin: 40,
        resumen:
          'Haz que tus programas analicen el margen de ganancia y muestren alertas claras según el resultado.',
        objetivo:
          'Evaluar condiciones numéricas con if, elif y else para clasificar escenarios reales.',
        contenidoHtml: `
          <p>Los <strong>condicionales</strong> permiten que un programa tome caminos diferentes dependiendo de los números ingresados.</p>
          <h3>Cuidado con la indentación</h3>
          <p>En Python, los <strong>4 espacios</strong> al inicio de la línea debajo de <code>if</code> o <code>else</code> indican qué instrucciones pertenecen a ese bloque. Eso mantiene el código limpio y legible.</p>
          <p>En el simulador inferior, intenta bajar el <em>precio por kilo</em> o subir los <em>jornales</em> hasta ver cómo Python cambia automáticamente de rama entre <strong>Saludable</strong>, <strong>Precaución</strong> y <strong>Pérdida</strong>.</p>
        `,
        codigoEjemplo: `# Evaluación automática de rentabilidad
margen = (ganancia_neta / ingreso_total) * 100 if ingreso_total > 0 else 0

if ganancia_neta < 0:
    estado = "ALERTA: La cosecha genera pérdida"
elif margen < 20:
    estado = "PRECAUCIÓN: Margen menor al 20%"
else:
    estado = "SALUDABLE: Cosecha rentable"

print(f"Margen: {margen:.1f}% -> {estado}")`,
        lenguajeCodigo: 'python',
        tipoLaboratorio: 'python-cosecha',
        ejercicioPapel:
          'Escribe tres reglas condicionales (SI... ENTONCES...) que ayudarían a tomar decisiones en la tienda escolar o en una asociación de productores.',
        repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
      },
      {
        id: 3003,
        slug: 'ciclos-inventario-rural-y-repositorios',
        titulo: 'Ciclos for, listas e inventario rural (con repositorio)',
        orden: 3,
        duracionMin: 50,
        resumen:
          'Recorre una lista de productos, detecta faltantes automáticamente y descarga el script listo para GitHub.',
        objetivo:
          'Construir un gestor básico de inventario usando listas, diccionarios y ciclos for en Python.',
        contenidoHtml: `
          <p>Cuando manejas decenas de productos en una finca o tienda veredal, usar una variable por producto es imposible. Con <strong>listas</strong> y <strong>ciclos <code>for</code></strong>, el mismo bloque de código procesa todos los artículos en orden.</p>
          <h3>Del aula a tu repositorio de código</h3>
          <p>Usa el <strong>Simulador de Inventario Rural</strong> abajo para agregar productos reales, ajustar existencias mínimas, ver la ejecución del ciclo <code>for</code> y descargar tu archivo <code>inventario_vereda.py</code> listo para subirlo a GitHub.</p>
        `,
        codigoEjemplo: `# Proyecto 2: Inventario básico para finca o tienda veredal
inventario = [
    {"producto": "Bulto de abono", "cantidad": 4, "minimo": 5, "precio": 125000},
    {"producto": "Semilla de maíz (kg)", "cantidad": 18, "minimo": 10, "precio": 12000},
    {"producto": "Cajas de empaque", "cantidad": 9, "minimo": 15, "precio": 4500},
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
print("Productos para reponer:", ", ".join(por_reponer) or "Ninguno")`,
        lenguajeCodigo: 'python',
        tipoLaboratorio: 'python-inventario',
        ejercicioPapel:
          'Anota 5 productos reales de tu tienda escolar, cocina o finca con su cantidad actual y cantidad mínima, y agrégalos en el simulador de inventario para generar tu propio script Python.',
        repoUrl: 'https://github.com/clauck89/CI-Emprendimiento',
      },
    ],
  },
];

export const webSandboxPresets = {
  'html-basico': {
    titulo: 'Módulo 1 · Huerta Escolar (HTML)',
    html: `<header>
  <h1>Huerta Escolar La Esperanza</h1>
  <p>Alimentos frescos sembrados por estudiantes de la vereda.</p>
</header>

<main>
  <section class="tarjeta">
    <h2>Cosecha de esta semana</h2>
    <ul>
      <li>Lechuga orgánica — $3.000</li>
      <li>Cilantro fresco — $1.500</li>
      <li>Tomate chonto (libra) — $2.800</li>
    </ul>
  </section>
</main>`,
    css: `body {
  background: #0f1720;
  color: #f4f1ea;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  padding: 1.25rem;
}
h1 { color: #e59a3c; margin-bottom: 0.25rem; }
.tarjeta {
  background: #18232f;
  border: 1px solid #2b3c4f;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
}`,
    js: `// En el Módulo 3 agregaremos interactividad aquí.`,
  },
  'css-tarjetas': {
    titulo: 'Módulo 2 · Tarjetas Accesibles (CSS)',
    html: `<header>
  <h1>Café de Altura El Mirador</h1>
  <p>Diseño adaptable en modo oscuro con alto contraste.</p>
</header>

<main class="cuadricula">
  <article class="tarjeta">
    <h2>Tostión Media</h2>
    <p>Notas dulces de panela y cacao. Cultivo familiar.</p>
    <strong>$14.000 / 250g</strong>
  </article>
  <article class="tarjeta">
    <h2>Café Molido Fino</h2>
    <p>Ideal para greca o colador de tela tradicional.</p>
    <strong>$13.500 / 250g</strong>
  </article>
</main>`,
    css: `body {
  background: #0f1720;
  color: #f4f1ea;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  padding: 1.25rem;
}
h1 { color: #e59a3c; margin-top: 0; }
.cuadricula {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}
.tarjeta {
  flex: 1 1 200px;
  background: #18232f;
  border: 1px solid #2b3c4f;
  border-left: 4px solid #e59a3c;
  border-radius: 10px;
  padding: 1rem;
}
strong { color: #4ad0b3; }`,
    js: `// Prueba cambiar #e59a3c por #2fa890 en la pestaña CSS.`,
  },
  'proyecto-final': {
    titulo: 'Módulo 3 · Mi Página Web Propia (HTML+CSS+JS)',
    html: `<header>
  <span class="insignia">Proyecto VeredaCode</span>
  <h1>Café y Panela La Pradera</h1>
  <p>Emprendimiento juvenil rural — pedidos directos sin intermediarios.</p>
</header>

<main class="tarjeta">
  <h2>Haz tu pedido de prueba</h2>
  <p>Bolsa de café artesanal 250g: <strong>$12.000</strong></p>
  <div class="acciones">
    <button id="btn-pedido" type="button">+ Agregar bolsa</button>
    <button id="btn-limpiar" type="button" class="secundario">Reiniciar</button>
  </div>
  <p id="resumen-pedido" aria-live="polite">Aún no has agregado bolsas.</p>
</main>`,
    css: `body {
  background: #0e1318;
  color: #f4f1ea;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  padding: 1.25rem;
}
.insignia {
  display: inline-block;
  background: #1d7a6b;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
h1 { color: #e59a3c; margin: 0.5rem 0 0.25rem; }
.tarjeta {
  background: #161e26;
  border: 1px solid #2b3947;
  border-radius: 12px;
  padding: 1.1rem;
  margin-top: 1rem;
}
.acciones { display: flex; gap: 0.6rem; flex-wrap: wrap; margin: 0.8rem 0; }
button {
  background: #e59a3c;
  color: #0e1318;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
button.secundario {
  background: #253341;
  color: #f4f1ea;
}
#resumen-pedido {
  color: #5eead4;
  font-weight: 600;
}`,
    js: `const btnPedido = document.getElementById('btn-pedido');
const btnLimpiar = document.getElementById('btn-limpiar');
const salida = document.getElementById('resumen-pedido');
let bolsas = 0;
const precio = 12000;

function actualizar() {
  if (bolsas === 0) {
    salida.textContent = 'Aún no has agregado bolsas.';
    return;
  }
  const total = bolsas * precio;
  salida.textContent =
    \`Pedido actual: \${bolsas} bolsa(s) — Total: $\${total.toLocaleString('es-CO')}\`;
}

btnPedido.addEventListener('click', () => {
  bolsas += 1;
  actualizar();
});

btnLimpiar.addEventListener('click', () => {
  bolsas = 0;
  actualizar();
});`,
  },
};
