import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { getDashboardRoute, type RoleCode } from '@eduai/shared';

export default function Index() {
  const { tokens, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!tokens) return <Redirect href="/login" />;

  const route = getDashboardRoute(tokens.user.roles as RoleCode[]);
  if (route.includes('student')) return <Redirect href="/(student)" />;
  if (route.includes('parent')) return <Redirect href="/(parent)" />;
  if (route.includes('teacher')) return <Redirect href="/(teacher)" />;
  return <Redirect href="/login" />;
}
