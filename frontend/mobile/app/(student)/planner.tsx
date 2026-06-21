import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

const TASKS = [
  { id: '1', label: 'Complete Chapter 4', color: tokens.colors.primaryBright },
  { id: '2', label: 'Practice quiz', color: tokens.colors.tertiary },
  { id: '3', label: '15 min AI review', color: tokens.colors.secondary },
];

export default function PlannerScreen() {
  return (
    <Screen>
      <StitchScreenHeader title="Study Planner" />
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.todayBanner}>
          <Text style={styles.todayTitle}>Today&apos;s Plan</Text>
          <Text style={styles.todayBody}>2 lessons · 1 quiz · 15 min AI review</Text>
        </View>
        {TASKS.map((task) => (
          <StitchCard key={task.id}>
            <View style={styles.taskRow}>
              <View style={[styles.dot, { backgroundColor: task.color }]} />
              <Text style={styles.taskLabel}>{task.label}</Text>
            </View>
          </StitchCard>
        ))}
        <Text style={styles.hint}>AI study plans sync with ai-service /planner/generate.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  todayBanner: {
    backgroundColor: tokens.colors.primaryContainer,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  todayTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  todayBody: { fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, marginTop: 4 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  taskLabel: { fontSize: tokens.fontSize.sm, fontWeight: '600', color: tokens.colors.text },
  hint: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.xs, marginTop: tokens.spacing.md, textAlign: 'center' },
});
