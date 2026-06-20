'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';
import { Download, FileQuestion, Loader2 } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

interface GeneratedQuestion {
  type: string;
  stem: string;
  options?: Array<{ label: string; isCorrect: boolean }>;
  explanation?: string;
  marks: number;
}

export function QuestionGenerator() {
  const { data: session } = useSession();
  const { t } = useLocale();
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Fractions');
  const [classLevel, setClassLevel] = useState(8);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

  const payload = { subject, topic, classLevel, count, difficulty: 'medium' as const };

  async function generate() {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${AI_BASE}/api/v1/generators/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      setQuestions(json.data.questions ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function exportFormat(format: 'pdf' | 'docx') {
    if (!session?.user?.accessToken) return;
    const res = await fetch(`${AI_BASE}/api/v1/generators/questions/export/${format}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject}-${topic}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            {t('ai.generator.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('ai.generator.subject')}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('ai.generator.topic')}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={classLevel}
            onChange={(e) => setClassLevel(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('ai.generator.generate')}
            </Button>
            <Button variant="outline" onClick={() => exportFormat('pdf')} disabled={!questions.length}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" onClick={() => exportFormat('docx')} disabled={!questions.length}>
              <Download className="mr-2 h-4 w-4" /> DOCX
            </Button>
          </div>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t('ai.generator.preview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="rounded-lg border border-border/50 p-4 text-sm">
                <p className="font-medium">
                  Q{i + 1}. ({q.marks} marks) {q.stem}
                </p>
                {q.options?.map((o, j) => (
                  <p key={j} className="ml-4 text-muted-foreground">
                    {String.fromCharCode(65 + j)}. {o.label}
                    {o.isCorrect ? ' ✓' : ''}
                  </p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
