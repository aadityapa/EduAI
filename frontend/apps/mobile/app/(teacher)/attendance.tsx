import { StyleSheet, Text, View } from 'react-native';

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.body}>POST erp-service /attendance from class roster</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  body: { color: '#64748b', marginTop: 8 },
});
