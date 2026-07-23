import { Tabs } from 'expo-router';
import { StitchTabBar, type StitchTabBarProps } from '../../src/components/stitch';
import { tokens } from '../../src/theme/tokens';

export default function TeacherLayout() {
  return (
    <Tabs
      tabBar={(props) => <StitchTabBar {...(props as unknown as StitchTabBarProps)} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.onSecondaryContainer,
        tabBarInactiveTintColor: tokens.colors.textMuted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="assignments" options={{ title: 'Homework' }} />
    </Tabs>
  );
}
