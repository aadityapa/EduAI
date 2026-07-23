import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchNotifications, markNotificationRead } from '../../src/api/services';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import { useCachedResource } from '../../src/hooks/useCachedResource';

type Notif = {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  readAt?: string | null;
  createdAt?: string;
};

export default function NotificationsScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchNotifications(authTokens.accessToken) as Promise<Notif[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<Notif[]>(
    authTokens ? 'erp_notifications' : null,
    authTokens ? fetcher : null,
  );

  const items = data ?? [];

  async function onRead(id: string) {
    if (!authTokens) return;
    try {
      await markNotificationRead(authTokens.accessToken, id);
      await reload();
    } catch {
      // ignore — list still shows cached
    }
  }

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading alerts…" />
      </Screen>
    );
  }

  if (error && items.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load alerts" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Alerts" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={
          <View>
            <OfflineBanner visible={offline} />
            <Text style={styles.hint}>
              In-app alerts from ERP. Device push uses Expo Notifications (EAS project ID for remote).
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState title="You're all caught up" body="School alerts and fee notices will appear here." />
        }
        renderItem={({ item }) => {
          const unread = !item.readAt;
          return (
            <Pressable onPress={() => void onRead(item.id)} accessibilityRole="button">
              <StitchCard style={unread ? styles.unread : undefined}>
                <Text style={styles.title}>{item.title ?? 'Notification'}</Text>
                <Text style={styles.body}>{item.body ?? item.message ?? ''}</Text>
                {item.createdAt ? (
                  <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
                ) : null}
              </StitchCard>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  hint: {
    color: tokens.colors.textMuted,
    fontSize: tokens.fontSize.xs,
    marginBottom: tokens.spacing.sm,
    lineHeight: 18,
  },
  unread: { borderColor: tokens.colors.primaryBright, borderWidth: 1.5 },
  title: { fontWeight: '700', color: tokens.colors.text, marginBottom: 4 },
  body: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm, lineHeight: 20 },
  meta: { color: tokens.colors.textMuted, fontSize: 10, marginTop: 8 },
});
