'use client';

import { signIn } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, Lock, Mail, Shield, Users } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@eduai/ui';
import { useAdminLocale } from '@/components/admin-locale-provider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('admin@demo.eduai.in');
  const [password, setPassword] = useState('Demo1234!');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError(t('admin.loginFailed'));
      return;
    }
    startTransition(() => {
      router.push('/dashboard');
      router.refresh();
    });
  }

  const features = [
    { icon: Users, label: t('admin.featureTenant') },
    { icon: BarChart3, label: t('admin.featureAnalytics') },
    { icon: Shield, label: t('admin.featureRbac') },
  ];

  return (
    <div className="stitch-auth-page">
      <motion.div
        className="stitch-auth-hero"
        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.32 }}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            {t('admin.heroEyebrow')}
          </p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-bold leading-tight lg:text-5xl">
            {t('admin.heroTitle')}
          </h1>
          <p className="mt-4 max-w-sm text-lg text-white/85">{t('admin.heroDescription')}</p>
        </div>
        <div className="relative z-10 mt-12 grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="stitch-auth-form-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.08 }}
      >
        <Card className="stitch-surface stitch-elevated w-full max-w-md border-0">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="font-display text-2xl font-bold">{t('admin.loginTitle')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('admin.loginSubtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('admin.workEmail')}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className="h-11 rounded-xl ps-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('admin.password')}</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11 rounded-xl ps-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                {t('admin.demoHint')}
              </p>
              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-full text-base font-medium"
              >
                {pending ? t('common.loading') : t('admin.continue')}
              </Button>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} EduAI Platform · Admin CRM
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
