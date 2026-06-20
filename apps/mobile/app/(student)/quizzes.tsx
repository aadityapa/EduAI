import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function QuizzesScreen() {
  const t = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('quiz.title', 'Quizzes')}</Text>
      <Text style={styles.body}>
        Take quizzes from your enrolled courses. Connect to learning-service quiz endpoints
        for live attempts.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  body: { color: '#64748b', lineHeight: 22 },
});
