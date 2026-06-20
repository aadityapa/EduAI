import { StyleSheet, Text, View } from 'react-native';

export default function PlannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Planner</Text>
      <Text style={styles.body}>
        AI-generated study plans sync with ai-service /planner/generate. Schedule reminders
        from the home screen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  body: { color: '#64748b', lineHeight: 22 },
});
