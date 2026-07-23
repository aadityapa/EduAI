import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * API host resolution:
 * - DEV_LAN_HOST / EXPO_PUBLIC_API_HOST for local Expo Go ↔ Nest on LAN
 * - Staging/prod URLs via EXPO_PUBLIC_*_URL (never commit secrets)
 */
function resolveHost(): string {
  return process.env.EXPO_PUBLIC_API_HOST ?? process.env.DEV_LAN_HOST ?? 'localhost';
}

function serviceUrl(envKey: string, port: number): string {
  const override = process.env[envKey];
  if (override) return override;
  const host = resolveHost();
  const appEnv = process.env.APP_ENV ?? process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
  if (appEnv === 'production' || appEnv === 'staging') {
    // Placeholders — replace via EAS secrets / EXPO_PUBLIC_* at build time
    const scheme = process.env.EXPO_PUBLIC_API_SCHEME ?? 'https';
    const apiHost = process.env.EXPO_PUBLIC_API_HOST ?? 'api.eduai.in';
    return `${scheme}://${apiHost}`;
  }
  return `http://${host}:${port}`;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  return {
    ...config,
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
        backgroundColor: '#1A73E8',
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          color: '#1A73E8',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      identityUrl: serviceUrl('EXPO_PUBLIC_IDENTITY_URL', 3001),
      learningUrl: serviceUrl('EXPO_PUBLIC_LEARNING_URL', 3003),
      aiUrl: serviceUrl('EXPO_PUBLIC_AI_URL', 3004),
      erpUrl: serviceUrl('EXPO_PUBLIC_ERP_URL', 3005),
      billingUrl: serviceUrl('EXPO_PUBLIC_BILLING_URL', 3006),
      appEnv: process.env.APP_ENV ?? process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
      devLanHost: resolveHost(),
      eas: easProjectId ? { projectId: easProjectId } : undefined,
    },
  };
};
