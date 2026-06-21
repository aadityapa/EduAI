import type { RoleCode } from '@eduai/shared';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      tenantId: string;
      schoolId?: string;
      roles: RoleCode[];
      permissions: string[];
      accessToken?: string;
    };
  }

  interface User {
    tenantId: string;
    schoolId?: string;
    roles: RoleCode[];
    permissions: string[];
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    tenantId: string;
    schoolId?: string;
    roles: RoleCode[];
    permissions: string[];
    accessToken?: string;
  }
}
