import "./assets/main.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

// @ts-expect-error otherwise you have to allowJs in tsconfig
import App from '@/App.vue'
import router from './router';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);

app.mount('#app');
