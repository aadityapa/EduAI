import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { tokens } from '../theme/tokens';

type TabRoute = { key: string; name: string; params?: object };
export type StitchTabBarProps = {
  state: { index: number; routes: TabRoute[] };
  descriptors: Record<string, { options: Record<string, unknown> }>;
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
};

export function MobileHeader({
  title,
  subtitle,
  onSettings,
}: {
  title: string;
  subtitle?: string;
  onSettings?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{title.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {onSettings ? (
        <Pressable style={styles.settingsBtn} onPress={onSettings}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MetricChip({
  icon,
  value,
  label,
  accent = tokens.colors.tertiary,
}: {
  icon: string;
  value: string | number;
  label: string;
  accent?: string;
}) {
  return (
    <View style={styles.metricChip}>
      <Text style={[styles.metricIcon, { color: accent }]}>{icon}</Text>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );
}

export function AiHero({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.aiHero} onPress={onPress}>
      <View style={styles.aiHeroBadge}>
        <Text style={styles.aiHeroBadgeIcon}>✦</Text>
      </View>
      <Text style={styles.aiHeroTitle}>Ask your AI Tutor</Text>
      <Text style={styles.aiHeroBody}>
        Stuck on a problem? Get instant personalized help with your homework.
      </Text>
      <Text style={styles.aiHeroArrow}>→</Text>
    </Pressable>
  );
}

export function ProgressBar({ progress, color = tokens.colors.primaryBright }: { progress: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, progress));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export function CourseCarouselCard({
  title,
  progress,
  icon,
  accent,
}: {
  title: string;
  progress: number;
  icon: string;
  accent: string;
}) {
  return (
    <View style={styles.courseCard}>
      <View style={[styles.courseIcon, { backgroundColor: accent + '18' }]}>
        <Text style={{ color: accent, fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={styles.courseTitle} numberOfLines={1}>
        {title}
      </Text>
      <ProgressBar progress={progress} color={accent} />
      <Text style={styles.coursePct}>{progress}% Complete</Text>
    </View>
  );
}

export function CourseCarousel({
  courses,
}: {
  courses: { id: string; title: string; progress: number; icon: string; accent: string }[];
}) {
  if (!courses.length) {
    return (
      <View style={styles.emptyCourses}>
        <Text style={styles.emptyCoursesText}>No active courses yet</Text>
      </View>
    );
  }
  return (
    <FlatList
      horizontal
      data={courses}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContent}
      renderItem={({ item }) => (
        <CourseCarouselCard
          title={item.title}
          progress={item.progress}
          icon={item.icon}
          accent={item.accent}
        />
      )}
    />
  );
}

export function BentoTile({
  title,
  subtitle,
  icon,
  wide,
  style,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  wide?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Text style={[styles.bentoIcon, wide && styles.bentoIconWide]}>{icon}</Text>
      <View style={wide ? styles.bentoWideText : undefined}>
        <Text style={[styles.bentoTitle, wide && styles.bentoTitleWide]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.bentoSubtitle, wide && styles.bentoSubtitleWide]}>{subtitle}</Text>
        ) : null}
      </View>
    </>
  );
  if (onPress) {
    return (
      <Pressable style={[styles.bentoTile, wide && styles.bentoWide, style]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return <View style={[styles.bentoTile, wide && styles.bentoWide, style]}>{content}</View>;
}

export function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StitchScreenHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <View style={styles.screenHeader}>
      <Text style={styles.screenHeaderTitle}>{title}</Text>
      {actionLabel ? <Text style={styles.sectionAction}>{actionLabel}</Text> : null}
    </View>
  );
}

export function StitchCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.stitchCard, style]}>{children}</View>;
}

export function StitchTabBar(props: StitchTabBarProps) {
  const { state, descriptors, navigation } = props;
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key].options;
        const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
        const label = typeof rawLabel === 'string' ? rawLabel : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const COURSE_ACCENTS = [tokens.colors.primaryBright, tokens.colors.secondary, tokens.colors.tertiary];
const COURSE_ICONS = ['∑', '⚗', '📜', '📐', '🌍'];

export function mapEnrollmentsToCourses(enrollments: unknown[]): {
  id: string;
  title: string;
  progress: number;
  icon: string;
  accent: string;
}[] {
  return enrollments.slice(0, 6).map((raw, i) => {
    const e = raw as { id?: string; course?: { title?: string; subject?: { name?: string } }; progress?: number };
    const title = e.course?.subject?.name ?? e.course?.title ?? `Course ${i + 1}`;
    return {
      id: e.id ?? String(i),
      title,
      progress: e.progress ?? [85, 42, 90, 60, 30][i % 5],
      icon: COURSE_ICONS[i % COURSE_ICONS.length],
      accent: COURSE_ACCENTS[i % COURSE_ACCENTS.length],
    };
  });
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.primaryContainer,
    borderWidth: 2,
    borderColor: tokens.colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: tokens.colors.primary, fontWeight: '700', fontSize: 16 },
  headerTitle: { fontSize: tokens.fontSize.lg, fontWeight: '700', color: tokens.colors.primary },
  headerSubtitle: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: { fontSize: 20, color: tokens.colors.primary },
  metricChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.outlineVariant + '50',
  },
  metricIcon: { fontSize: 22 },
  metricValue: { fontSize: tokens.fontSize.lg, fontWeight: '700', color: tokens.colors.text },
  metricLabel: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted },
  aiHero: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    minHeight: 160,
    overflow: 'hidden',
    marginBottom: tokens.spacing.md,
  },
  aiHeroBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aiHeroBadgeIcon: { color: tokens.colors.tertiary, fontSize: 18 },
  aiHeroTitle: { color: '#fff', fontSize: tokens.fontSize.xl, fontWeight: '700', marginBottom: 6 },
  aiHeroBody: { color: 'rgba(255,255,255,0.85)', fontSize: tokens.fontSize.sm, lineHeight: 20, maxWidth: '85%' },
  aiHeroArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
    overflow: 'hidden',
  },
  progressTrack: {
    height: 6,
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressFill: { height: 6, borderRadius: 3 },
  courseCard: {
    width: 160,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    marginRight: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.outlineVariant + '80',
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  courseTitle: { fontWeight: '700', fontSize: tokens.fontSize.sm, color: tokens.colors.text, marginBottom: 4 },
  coursePct: { fontSize: 10, color: tokens.colors.textMuted },
  carouselContent: { paddingVertical: 8 },
  emptyCourses: { paddingVertical: 24, alignItems: 'center' },
  emptyCoursesText: { color: tokens.colors.textMuted },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  sectionTitle: { fontSize: tokens.fontSize.lg, fontWeight: '700', color: tokens.colors.text },
  sectionAction: { fontSize: tokens.fontSize.xs, fontWeight: '600', color: tokens.colors.primaryBright },
  bentoTile: {
    flex: 1,
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    minHeight: 88,
  },
  bentoWide: {
    flex: undefined,
    width: '100%',
    backgroundColor: tokens.colors.primaryBright,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  bentoWideText: { flex: 1 },
  bentoIconWide: { marginBottom: 0, marginRight: 12, color: 'rgba(255,255,255,0.7)', fontSize: 28 },
  bentoTitleWide: { color: '#fff' },
  bentoSubtitleWide: { color: 'rgba(255,255,255,0.85)' },
  bentoIcon: { fontSize: 22, marginBottom: 4, color: tokens.colors.textMuted },
  bentoTitle: { fontWeight: '700', fontSize: tokens.fontSize.sm, color: tokens.colors.text },
  bentoSubtitle: { fontSize: 10, color: tokens.colors.textMuted, marginTop: 2 },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  screenHeaderTitle: { fontSize: tokens.fontSize.lg, fontWeight: '700', color: tokens.colors.text },
  stitchCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.outlineVariant,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: tokens.radius.full,
  },
  tabItemActive: { backgroundColor: tokens.colors.secondaryContainer },
  tabLabel: { fontSize: 10, fontWeight: '500', color: tokens.colors.textMuted, textAlign: 'center' },
  tabLabelActive: { color: tokens.colors.onSecondaryContainer, fontWeight: '700' },
});
