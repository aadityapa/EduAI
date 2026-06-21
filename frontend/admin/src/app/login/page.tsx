'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { BarChart3, Shield, Users } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@eduai/ui';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@demo.eduai.in');
  const [password, setPassword] = useState('Demo1234!');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Login failed');
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="stitch-auth-page">
      <div className="stitch-auth-hero">
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">EduAI Platform</p>
          <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight lg:text-5xl">
            Admin CRM built for modern schools
          </h1>
          <p className="mt-4 max-w-sm text-lg text-white/85">
            Manage tenants, billing, users, and AI analytics from one control center.
          </p>
        </div>
        <div className="relative z-10 mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, label: 'Multi-tenant' },
            { icon: BarChart3, label: 'Live analytics' },
            { icon: Shield, label: 'Enterprise RBAC' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stitch-auth-form-panel">
        <Card className="stitch-surface stitch-elevated w-full max-w-md border-0">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <p className="text-sm text-muted-foreground">Admin portal · port 3002</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-11 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-11 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                Demo: admin@demo.eduai.in / Demo1234!
              </p>
              <Button type="submit" className="h-11 w-full rounded-full text-base font-medium">
                Continue
              </Button>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} EduAI Platform · Admin CRM
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
