# VeredaCode — Plataforma Educativa de Base Tecnológica (ODS 4)

Plataforma educativa web **progresiva (PWA)**, **accesible (WCAG 2.1 AA)** y de **bajo consumo de datos**, diseñada para llevar formación tecnológica práctica a estudiantes y docentes de municipios y zonas periféricas con conectividad limitada o inestable.

## Arquitectura desacoplada

```text
[Estudiante: PWA Vue 3 + Vite (Modo Oscuro / Offline)]
          │
          ▼
[Nginx: Proxy Inverso + Compresión Gzip + Archivos Estáticos]
          │
          ▼
[WordPress Headless (FPM): Cursos y Módulos vía API REST]
          │
          ▼
[MySQL 8.0: Base de datos aislada en contenedor]
```

Todo el sistema corre en **contenedores Docker** sobre Linux, con control de versiones en GitHub e **Integración Continua** mediante [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Las 3 rutas progresivas (texto + práctica sin video pesado)

1. **Ruta 1 — Alfabetización digital y pensamiento computacional (Inicial):** manejo práctico de computador/celular, seguridad digital y algoritmos en papel y por bloques (incluye laboratorio visual *Robot Recolector*).
2. **Ruta 2 — Desarrollo web desde cero: HTML, CSS y JavaScript (Piloto inicial):** editor interactivo en vivo dentro del navegador sin instalaciones, con descarga de la propia página web del estudiante (`.html`).
3. **Ruta 3 — Introducción a la programación con Python (Práctico):** variables, condicionales y ciclos aplicados al entorno local (calculadora de costos de cosecha e inventario rural), con exportación de scripts `.py` listos para repositorios Git.

## Inicio rápido con Docker

1. (Opcional) Copia `.env.example` a `.env` y personaliza las contraseñas:
   ```bash
   cp .env.example .env
   ```
2. Construye y levanta todos los contenedores:
   ```bash
   docker compose up -d --build
   ```
3. Accede a los servicios:
   - **Plataforma estudiantil (PWA Vue 3):** `http://localhost:8080`
   - **Salud del servidor web (Nginx):** `http://localhost:8080/health`
   - **Panel docente / Headless CMS:** `http://localhost:8080/wp-admin/`
   - **API REST compacta de VeredaCode:** `http://localhost:8080/wp-json/veredacode/v1/rutas`

### Poblar las 3 rutas en WordPress Headless

El contenedor de WordPress monta automáticamente el mu-plugin `wordpress/mu-plugins/veredacode-headless.php`. Después de completar el asistente inicial en `http://localhost:8080/wp-admin/`:

1. Ingresa a **Herramientas → VeredaCode CMS**.
2. Pulsa **"Cargar las 3 Rutas Iniciales de VeredaCode"**.
3. La PWA detectará los contenidos desde `/wp-json/veredacode/v1/rutas` y los guardará en caché offline automáticamente.

> **Modo resiliente:** incluso antes de configurar WordPress o sin conexión a internet, la PWA funciona al 100% con su currículo base integrado y sus 3 laboratorios interactivos locales.

## Desarrollo local del Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173 (proxy a /wp-json -> localhost:8080)
npm test          # Pruebas unitarias con Vitest
npm run build     # Build de producción + Service Worker PWA
```

## Accesibilidad (WCAG 2.1 AA) y Bajo Consumo

- Enlace de salto al contenido principal y navegación completa por teclado.
- Modo oscuro de alto contraste + modo **Alto contraste AAA** y reducción de animaciones.
- Control de tamaño de fuente (`90%` a `130%`) y **Modo ahorro de datos**.
- Tipografía del sistema (sin fuentes web externas bloqueantes), compresión Gzip en Nginx y caché Workbox PWA.
- Exportación/importación de progreso estudiantil en `.json` para equipos escolares compartidos.
