import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { loadPushToken, savePushToken } from '../auth/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export type PushRegistrationResult = {
  token: string | null;
  status: 'granted' | 'denied' | 'unavailable' | 'web' | 'missing-project-id';
  detail?: string;
};

/**
 * Register for Expo push. Does not invent FCM secrets —
 * requires EAS projectId in app config for device tokens.
 * Local study reminders work without a projectId.
 */
export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  if (Platform.OS === 'web') {
    return { token: null, status: 'web', detail: 'Push not supported on web' };
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return { token: null, status: 'denied' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'EduAI',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants.easConfig as { projectId?: string } | undefined)?.projectId;

  if (!projectId) {
    const cached = await loadPushToken();
    return {
      token: cached,
      status: 'missing-project-id',
      detail: 'Set EXPO_PUBLIC_EAS_PROJECT_ID for remote push; local reminders still work',
    };
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    await savePushToken(token.data);
    return { token: token.data, status: 'granted' };
  } catch (e) {
    return {
      token: await loadPushToken(),
      status: 'unavailable',
      detail: e instanceof Error ? e.message : 'Token registration failed',
    };
  }
}

export async function scheduleStudyReminder(title: string, body: string, seconds = 3600) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { seconds } as Notifications.NotificationTriggerInput,
  });
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
