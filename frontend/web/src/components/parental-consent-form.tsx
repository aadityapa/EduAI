'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@eduai/ui';
import {
  actionGrantConsent,
  actionRequestErasure,
  actionRequestExport,
  actionVerifyConsent,
} from '@/app/parent/privacy/actions';

/**
 * Scaffold for verifiable parental consent + DSR actions.
 * Mutations go through server actions → identity-service.
 */
export function ParentalConsentForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [subjectUserId, setSubjectUserId] = useState('');
  const [purpose, setPurpose] = useState('ai_tutor');
  const [consentId, setConsentId] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) => {
    setError(null);
    setMessage(null);
    startTransition(() => {
      void fn()
        .then(() => router.refresh())
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Request failed');
        });
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface/40 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Linked student user id</span>
          <Input
            value={subjectUserId}
            onChange={(e) => setSubjectUserId(e.target.value)}
            placeholder="UUID of linked child"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Purpose</span>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="ai_tutor">AI tutor</option>
            <option value="learning_analytics">Learning analytics</option>
            <option value="parental_oversight">Parental oversight</option>
            <option value="marketing">Marketing</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={pending || !subjectUserId}
          onClick={() =>
            run(async () => {
              const res = await actionGrantConsent({
                purpose,
                subjectUserId,
                parentalMethod: 'email_otp',
              });
              setConsentId(res.id);
              setMessage(
                'verificationCodeHint' in res && res.verificationCodeHint
                  ? `Pending verification. Dev OTP: ${res.verificationCodeHint}`
                  : 'Consent pending parental verification — check email OTP.',
              );
            })
          }
        >
          Grant parental consent
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            run(async () => {
              await actionRequestExport();
              setMessage('Export request submitted (auto-fulfilled when permitted).');
            })
          }
        >
          Export my data
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            run(async () => {
              await actionRequestErasure('Parent-requested erasure scaffold');
              setMessage('Erasure queued for tenant admin completion.');
            })
          }
        >
          Request erasure
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Consent id</span>
          <Input value={consentId} onChange={(e) => setConsentId(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">OTP</span>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <Button
          type="button"
          disabled={pending || !consentId || !code}
          onClick={() =>
            run(async () => {
              await actionVerifyConsent(consentId, code);
              setMessage('Parental consent verified.');
              setCode('');
            })
          }
        >
          Verify OTP
        </Button>
      </div>

      {message && <p className="text-sm text-foreground">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
