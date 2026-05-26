
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9453765da8ee4bcdace8ea4a6fb3da71',
  appName: 'quecomer',
  webDir: 'dist',
  server: {
    url: 'https://9453765d-a8ee-4bcd-ace8-ea4a6fb3da71.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F97316',
      showSpinner: false
    }
  }
};

export default config;
