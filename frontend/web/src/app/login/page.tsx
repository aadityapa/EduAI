'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, Sparkles, BookOpen, GraduationCap, Heart } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  STITCH_IMAGES,
} from '@eduai/ui';
import { LocaleProvider, useLocale } from '@/components/locale-provider';

type LoginMode = 'email' | 'otp';
type Portal = 'student' | 'teacher' | 'parent';

const PORTAL_EMAILS: Record<Portal, string> = {
  student: 'student@demo.eduai.in',
  teacher: 'teacher@demo.eduai.in',
  parent: 'parent@demo.eduai.in',
};

function LoginPageInner() {
  const router = useRouter();
  const { t } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const [portal, setPortal] = useState<Portal>('student');
  const [mode, setMode] = useState<LoginMode>('email');
  const [email, setEmail] = useState(PORTAL_EMAILS.student);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const portals: { id: Portal; label: string }[] = [
    { id: 'student', label: t('login.student') },
    { id: 'teacher', label: t('login.teacher') },
    { id: 'parent', label: t('login.parent') },
  ];

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t('login.invalidCredentials'));
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  async function handleOAuth(provider: 'google' | 'apple') {
    setError(
      `${provider === 'google' ? 'Google' : 'Apple'} OAuth is stubbed for Sprint 1. Configure credentials in Sprint 2.`,
    );
    await signIn(provider, { redirect: false }).catch(() => undefined);
  }

  return (
    <div className="stitch-auth-page">
      <div
        className="stitch-auth-hero-image hidden lg:flex"
        role="img"
        aria-label={t('login.heroTitle')}
        style={{
          backgroundImage: `url(${STITCH_IMAGES.loginClassroom})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight">{t('login.heroTitle')}</h1>
          <p className="mt-4 max-w-sm text-lg text-white/85">{t('login.heroDescription')}</p>
        </div>
        <div className="relative z-10 grid gap-3">
          {[
            { icon: BookOpen, label: t('login.featureLessons') },
            { icon: GraduationCap, label: t('login.featureTeacher') },
            { icon: Heart, label: t('login.featureParent') },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stitch-auth-form-panel">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="stitch-surface stitch-elevated border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="font-display text-2xl font-bold">{t('login.welcome')}</CardTitle>
              <CardDescription>{t('login.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={portal}
                onValueChange={(value) => {
                  const next = value as Portal;
                  setPortal(next);
                  setEmail(PORTAL_EMAILS[next]);
                }}
              >
                <TabsList className="grid w-full grid-cols-3 rounded-full">
                  {portals.map((p) => (
                    <TabsTrigger key={p.id} value={p.id} className="rounded-full">
                      {p.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'email' ? 'bg-background shadow-sm' : ''}`}
                  onClick={() => setMode('email')}
                >
                  {t('login.email')}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'otp' ? 'bg-background shadow-sm' : ''}`}
                  onClick={() => setMode('otp')}
                >
                  {t('login.otp')}
                </button>
              </div>

              {mode === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('login.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@school.edu"
                        className="ps-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="ps-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" className="h-11 w-full rounded-full" size="lg" disabled={loading}>
                    {loading ? t('login.signingIn') : t('login.signIn')}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-email">{t('login.email')}</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="you@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">{t('login.otpCode')}</Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit code (placeholder)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    OTP login UI placeholder — SMS/email delivery in Sprint 2.
                  </p>
                  <Button variant="secondary" className="w-full" disabled>
                    Send OTP (Coming Soon)
                  </Button>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t('login.orContinue')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleOAuth('google')}>
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleOAuth('apple')}>
                  Apple
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Local demo accounts come from database seed — do not use demo
                credentials in production.
                <br />
                Admin CRM:{' '}
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3002'}
                  className="text-primary underline"
                >
                  localhost:3002
                </a>
                {' · '}
                Mobile: Expo port 8081
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <LocaleProvider>
      <LoginPageInner />
    </LocaleProvider>
  );
}
