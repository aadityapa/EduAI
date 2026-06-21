import { Tabs } from 'expo-router';
import { StitchTabBar, type StitchTabBarProps } from '../../src/components/stitch';
import { tokens } from '../../src/theme/tokens';

export default function StudentLayout() {
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
      <Tabs.Screen name="courses" options={{ title: 'Courses' }} />
      <Tabs.Screen name="tutor" options={{ title: 'AI Hub' }} />
      <Tabs.Screen name="hub" options={{ title: 'Hub' }} />
      <Tabs.Screen name="gamification" options={{ title: 'Rewards' }} />
      <Tabs.Screen name="quizzes" options={{ href: null }} />
      <Tabs.Screen name="planner" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
