import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../theme/tokens';
import { MIN_TAP } from './feedback';

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

/** Alias kept for call sites that want explicit naming. */
export function SafeScreen(props: { children: React.ReactNode; style?: ViewStyle }) {
  return <Screen {...props} />;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function KpiCard({
  label,
  value,
  accent = tokens.colors.primary,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <View style={[styles.kpi, { borderLeftColor: accent }]}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  variant = 'filled',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'filled' | 'outline';
}) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.buttonOutline,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      hitSlop={4}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? tokens.colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.buttonText, isOutline && styles.buttonTextOutline]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function PortalBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.colors.background },
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    ...tokens.shadow.sm,
  },
  kpi: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    borderLeftWidth: 4,
    minWidth: '45%',
  },
  kpiLabel: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginBottom: 4 },
  kpiValue: { fontSize: tokens.fontSize.lg, fontWeight: '700' },
  button: {
    backgroundColor: tokens.colors.primaryBright,
    borderRadius: tokens.radius.full,
    minHeight: MIN_TAP,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: tokens.spacing.xs,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: tokens.colors.primary,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: tokens.fontSize.md },
  buttonTextOutline: { color: tokens.colors.primary },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.6 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: tokens.radius.full,
    marginBottom: tokens.spacing.sm,
  },
  badgeText: { fontSize: tokens.fontSize.xs, fontWeight: '600' },
});

export { tokens };
export { EmptyState, ErrorState, LoadingState, OfflineBanner, themedRefreshControl, MIN_TAP } from './feedback';
