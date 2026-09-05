import './assets/css/main.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';
import ui from '@nuxt/ui/vue-plugin';

const app = createApp(App);

app.use(router);
app.use(VueFire, {
  firebaseApp,
  modules: [
  ],
});
app.use(ui);
app.mount('#app');
