import './assets/css/main.css';

import { createApp } from 'vue';
import { Capacitor } from '@capacitor/core';

import App from './App.vue';
import router from './router';
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';
import ui from '@nuxt/ui/vue-plugin';

if (Capacitor.isNativePlatform()) {
  // The native app already bundles all assets locally, so a service worker only causes
  // the WebView to serve stale cached builds across `cap run android` reinstalls.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  }
} else {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }));
}

const app = createApp(App);

app.use(router);
app.use(VueFire, {
  firebaseApp,
  modules: [
  ],
});
app.use(ui);
app.mount('#app');
