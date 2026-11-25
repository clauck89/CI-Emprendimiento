import { createApp } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import router from './router/index.js';
import { applyPreferencesToDom } from './stores/preferences.js';
import './styles/main.css';

applyPreferencesToDom();

if (typeof window !== 'undefined') {
  registerSW({ immediate: true });
}

createApp(App).use(router).mount('#app');
