'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@eduai/ui';
type LoginMode = 'email' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="portal-background flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-0 shadow-glass">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Welcome to EduAI</CardTitle>
            <CardDescription>Sign in to continue learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
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
              Demo: admin@demo.eduai.in / Demo1234!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
