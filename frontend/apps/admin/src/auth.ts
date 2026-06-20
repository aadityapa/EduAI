import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { resolveAuthSecret, type RoleCode } from '@eduai/shared';

const identityUrl = process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ?? 'http://localhost:3001';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: resolveAuthSecret(),
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${identityUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            device: { name: 'Admin Portal', platform: 'web' },
          }),
        });
        if (!res.ok) return null;
        const json = await res.json();
        const { user, accessToken } = json.data;
        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name ?? ''}`.trim(),
          tenantId: user.tenant_id,
          schoolId: user.school_id,
          roles: user.roles as RoleCode[],
          permissions: user.permissions ?? [],
          accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.tenantId = user.tenantId;
        token.schoolId = user.schoolId;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.tenantId = token.tenantId as string;
        session.user.schoolId = token.schoolId as string | undefined;
        session.user.roles = (token.roles as RoleCode[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
        session.user.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
});
