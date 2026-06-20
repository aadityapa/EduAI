import { StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.body}>
        Push notifications via Expo Notifications. Configure in app.json and register
        device tokens with erp-service notifications endpoint.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  body: { color: '#64748b', marginTop: 8, lineHeight: 22 },
});
