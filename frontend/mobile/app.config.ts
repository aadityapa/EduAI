import type { ExpoConfig } from 'expo/config';

const apiHost = process.env.DEV_LAN_HOST ?? 'localhost';

export default (): ExpoConfig => ({
  name: 'EduAI',
  slug: 'eduai-mobile',
  version: '0.9.0',
  orientation: 'portrait',
  scheme: 'eduai',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'in.eduai.mobile',
  },
  android: {
    package: 'in.eduai.mobile',
    adaptiveIcon: {
      backgroundColor: '#005bbf',
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        color: '#005bbf',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    identityUrl: `http://${apiHost}:3001`,
    learningUrl: `http://${apiHost}:3003`,
    aiUrl: `http://${apiHost}:3004`,
    erpUrl: `http://${apiHost}:3005`,
    devLanHost: apiHost,
  },
});
