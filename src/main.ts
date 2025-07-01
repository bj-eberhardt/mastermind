import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { i18n } from './i18n.js';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.mount('#app');
