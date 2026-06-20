import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TeacherLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primaryColor,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="assignments" options={{ title: 'Homework' }} />
    </Tabs>
  );
}
