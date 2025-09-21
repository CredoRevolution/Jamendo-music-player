import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import './styles/base.scss';

import App from './App.vue';
import { useLibraryStore } from './stores/library.store';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

// hydrate library from localStorage
useLibraryStore().load();
