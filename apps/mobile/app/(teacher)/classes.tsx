import { StyleSheet, Text, View } from 'react-native';

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      <Text style={styles.body}>Connected to erp-service /classes/mine</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  body: { color: '#64748b', marginTop: 8 },
});
