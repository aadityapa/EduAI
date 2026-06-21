import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../src/i18n/useTranslation';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

const MOCK_QUIZZES = [
  { id: '1', title: 'Algebra Quiz 3', due: 'Due tomorrow', status: 'New' as const, score: null },
  { id: '2', title: 'Science MCQ', due: 'Completed', status: 'Done' as const, score: '92%' },
];

export default function QuizzesScreen() {
  const t = useTranslation();
  return (
    <Screen>
      <StitchScreenHeader title={t('quiz.title', 'Quizzes')} />
      <ScrollView contentContainerStyle={styles.list}>
        {MOCK_QUIZZES.map((q) => (
          <StitchCard key={q.id}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.title}>{q.title}</Text>
                <Text style={styles.meta}>{q.due}</Text>
              </View>
              {q.status === 'New' ? (
                <View style={styles.badgeNew}>
                  <Text style={styles.badgeNewText}>New</Text>
                </View>
              ) : (
                <Text style={styles.score}>{q.score}</Text>
              )}
            </View>
          </StitchCard>
        ))}
        <Text style={styles.hint}>Live quiz attempts sync with learning-service endpoints.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flex: { flex: 1 },
  title: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  meta: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
  badgeNew: {
    backgroundColor: tokens.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: tokens.radius.full,
  },
  badgeNewText: { color: tokens.colors.primaryBright, fontSize: tokens.fontSize.xs, fontWeight: '700' },
  score: { color: tokens.colors.secondary, fontWeight: '700', fontSize: tokens.fontSize.sm },
  hint: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.xs, marginTop: tokens.spacing.md, textAlign: 'center' },
});
