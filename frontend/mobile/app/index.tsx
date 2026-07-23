import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { getDashboardRoute, type RoleCode } from '@eduai/shared';
import { tokens } from '../src/theme/tokens';

export default function Index() {
  const { tokens: auth, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: tokens.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={tokens.colors.primaryBright} />
      </View>
    );
  }

  if (!auth) return <Redirect href="/login" />;

  const route = getDashboardRoute(auth.user.roles as RoleCode[]);
  if (route.includes('student')) return <Redirect href="/(student)" />;
  if (route.includes('parent')) return <Redirect href="/(parent)" />;
  if (route.includes('teacher')) return <Redirect href="/(teacher)" />;
  return <Redirect href="/login" />;
}
