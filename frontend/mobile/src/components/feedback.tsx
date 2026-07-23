import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type RefreshControlProps,
} from 'react-native';
import { tokens } from '../theme/tokens';

/** Minimum comfortable tap target for student surfaces (44pt). */
export const MIN_TAP = 44;

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={tokens.colors.primaryBright} size="large" />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.center} accessibilityRole="summary">
      <Text style={styles.emptyTitle}>{title}</Text>
      {body ? <Text style={styles.muted}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          onPress={onAction}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  body,
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center} accessibilityRole="alert">
      <Text style={styles.errorTitle}>{title}</Text>
      {body ? <Text style={styles.muted}>{body}</Text> : null}
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          onPress={onRetry}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.actionText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function OfflineBanner({ visible, message = 'Offline — showing cached data' }: { visible: boolean; message?: string }) {
  if (!visible) return null;
  return (
    <View style={styles.offline} accessibilityLiveRegion="polite">
      <Text style={styles.offlineText}>{message}</Text>
    </View>
  );
}

export function themedRefreshControl(
  props: Pick<RefreshControlProps, 'refreshing' | 'onRefresh'>,
): ReactElement {
  return (
    <RefreshControl
      refreshing={props.refreshing}
      onRefresh={props.onRefresh}
      tintColor={tokens.colors.primaryBright}
      colors={[tokens.colors.primaryBright]}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  muted: {
    color: tokens.colors.textMuted,
    fontSize: tokens.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  emptyTitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.error,
    textAlign: 'center',
  },
  actionBtn: {
    minHeight: MIN_TAP,
    minWidth: 120,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
  },
  actionText: { color: '#fff', fontWeight: '700', fontSize: tokens.fontSize.sm },
  pressed: { opacity: 0.85 },
  offline: {
    backgroundColor: tokens.colors.xp + '33',
    borderColor: tokens.colors.xp,
    borderWidth: 1,
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.sm,
  },
  offlineText: {
    color: tokens.colors.text,
    fontSize: tokens.fontSize.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
});
