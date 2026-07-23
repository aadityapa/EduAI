import { Tabs } from 'expo-router';
import { StitchTabBar, type StitchTabBarProps } from '../../src/components/stitch';
import { tokens } from '../../src/theme/tokens';

export default function ParentLayout() {
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
      <Tabs.Screen name="children" options={{ title: 'Children' }} />
      <Tabs.Screen name="fees" options={{ title: 'Fees' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
    </Tabs>
  );
}
