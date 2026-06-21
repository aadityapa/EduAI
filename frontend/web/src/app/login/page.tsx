'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  STITCH_IMAGES,
} from '@eduai/ui';
type LoginMode = 'email' | 'otp';
type Portal = 'student' | 'teacher' | 'parent';

const PORTALS: { id: Portal; label: string; email: string }[] = [
  { id: 'student', label: 'Student', email: 'student@demo.eduai.in' },
  { id: 'teacher', label: 'Teacher', email: 'teacher@demo.eduai.in' },
  { id: 'parent', label: 'Parent', email: 'parent@demo.eduai.in' },
];

export default function LoginPage() {
  const router = useRouter();
  const [portal, setPortal] = useState<Portal>('student');
  const [mode, setMode] = useState<LoginMode>('email');
  const [email, setEmail] = useState('student@demo.eduai.in');
  const [password, setPassword] = useState('Demo1234!');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError('Invalid email or password');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  async function handleOAuth(provider: 'google' | 'apple') {
    setError(`${provider === 'google' ? 'Google' : 'Apple'} OAuth is stubbed for Sprint 1. Configure credentials in Sprint 2.`);
    await signIn(provider, { redirect: false }).catch(() => undefined);
  }

  return (
    <div className="stitch-auth-page">
      <div
        className="stitch-auth-hero-image hidden lg:flex"
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
          <h1 className="max-w-md text-4xl font-bold leading-tight">Learn smarter with AI</h1>
          <p className="mt-4 max-w-sm text-lg text-white/85">
            Courses, quizzes, AI tutor, and parent insights — designed for CBSE & ICSE.
          </p>
        </div>
        <div className="relative z-10 grid gap-3">
          {[
            { icon: BookOpen, label: 'Interactive lessons' },
            { icon: GraduationCap, label: 'Teacher tools' },
            { icon: Heart, label: 'Parent dashboard' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stitch-auth-form-panel">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="stitch-surface stitch-elevated border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to EduAI</CardTitle>
            <CardDescription>Student · Teacher · Parent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex rounded-full border bg-muted p-1">
              {PORTALS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPortal(p.id);
                    setEmail(p.email);
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                    portal === p.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg bg-muted p-1">
              <button
                type="button"
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'email' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setMode('email')}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'otp' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setMode('otp')}
              >
                OTP
              </button>
            </div>

            {mode === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@school.edu"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="h-11 w-full rounded-full" size="lg" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-email">Email</Label>
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="you@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
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
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
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
              Demo password: Demo1234!
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
