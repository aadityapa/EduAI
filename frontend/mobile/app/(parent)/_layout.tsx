import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ParentLayout() {
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
      <Tabs.Screen name="children" options={{ title: 'Children' }} />
      <Tabs.Screen name="fees" options={{ title: 'Fees' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
    </Tabs>
  );
}
