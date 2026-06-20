import { StyleSheet, Text, View } from 'react-native';

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homework & Assignments</Text>
      <Text style={styles.body}>View and publish assignments via erp-service</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  body: { color: '#64748b', marginTop: 8 },
});
