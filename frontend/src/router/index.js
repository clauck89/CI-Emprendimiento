import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../views/HomeView.vue');
const RutasView = () => import('../views/RutasView.vue');
const RutaDetalleView = () => import('../views/RutaDetalleView.vue');
const ModuloView = () => import('../views/ModuloView.vue');
const LaboratorioView = () => import('../views/LaboratorioView.vue');
const AcercaView = () => import('../views/AcercaView.vue');

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: HomeView,
    meta: { title: 'Inicio — VeredaCode' },
  },
  {
    path: '/rutas',
    name: 'rutas',
    component: RutasView,
    meta: { title: 'Rutas de aprendizaje — VeredaCode' },
  },
  {
    path: '/rutas/:slug',
    name: 'ruta-detalle',
    component: RutaDetalleView,
    meta: { title: 'Detalle de ruta — VeredaCode' },
  },
  {
    path: '/rutas/:slug/modulo/:moduloSlug',
    name: 'modulo',
    component: ModuloView,
    meta: { title: 'Módulo de estudio — VeredaCode' },
  },
  {
    path: '/laboratorio',
    name: 'laboratorio',
    component: LaboratorioView,
    meta: { title: 'Laboratorio interactivo — VeredaCode' },
  },
  {
    path: '/acerca',
    name: 'acerca',
    component: AcercaView,
    meta: { title: 'Arquitectura y ODS 4 — VeredaCode' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  if (typeof document !== 'undefined') {
    document.title = to.meta?.title || 'VeredaCode — Educación Tecnológica Accesible (ODS 4)';
    const main = document.getElementById('contenido-principal');
    if (main) {
      main.focus({ preventScroll: true });
    }
  }
});

export default router;
