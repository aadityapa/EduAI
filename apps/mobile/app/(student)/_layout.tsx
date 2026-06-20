import { Tabs } from 'expo-router';
import { tokens } from '../../src/theme/tokens';

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textMuted,
        tabBarStyle: { backgroundColor: tokens.colors.surface, borderTopColor: tokens.colors.border },
        headerStyle: { backgroundColor: tokens.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="courses" options={{ title: 'Courses' }} />
      <Tabs.Screen name="tutor" options={{ title: 'AI Tutor' }} />
      <Tabs.Screen name="quizzes" options={{ title: 'Quizzes' }} />
      <Tabs.Screen name="planner" options={{ title: 'Planner' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
