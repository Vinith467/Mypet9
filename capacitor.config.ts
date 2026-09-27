import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mypet9.app',
  appName: 'MyPet9',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
};

export default config;
