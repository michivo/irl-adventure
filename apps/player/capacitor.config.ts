import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.michivo.irladventure.player',
  appName: 'IRL Adventure',
  webDir: 'dist',
  plugins: {
    "SystemBars": {
      "insetsHandling": "disable"
    }
  }  
};

export default config;
