import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from './App.vue';
import router from './router';
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(VueFire, {
  firebaseApp,
  modules: [
  ],
});

app.mount('#app');
