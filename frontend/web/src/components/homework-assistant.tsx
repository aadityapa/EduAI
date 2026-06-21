'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';
import { FileText, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

interface HomeworkResult {
  conversationId: string;
  analysis: string;
  steps: string[];
  hints: string[];
  answer: string;
  alternativeSolution: string;
  similarQuestions: string[];
  tokensUsed: number;
}

export function HomeworkAssistant() {
  const { data: session } = useSession();
  const { t } = useLocale();
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HomeworkResult | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; title: string | null; updatedAt: string }>>([]);

  async function analyze() {
    if (!session?.user?.accessToken || (!text.trim() && !imageUrl.trim())) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${AI_BASE}/api/v1/homework/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          text: text.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Analysis failed');
      setResult(json.data);
      loadHistory();
    } catch (err) {
      setResult({
        conversationId: '',
        analysis: err instanceof Error ? err.message : t('common.error'),
        steps: [],
        hints: [],
        answer: '',
        alternativeSolution: '',
        similarQuestions: [],
        tokensUsed: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    if (!session?.user?.accessToken) return;
    const res = await fetch(`${AI_BASE}/api/v1/homework/history`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    if (res.ok) {
      const json = await res.json();
      setHistory(json.data ?? []);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('ai.homework.upload')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('ai.homework.textPlaceholder')}
            rows={6}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm"
          />
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t('ai.homework.imagePlaceholder')}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            {t('ai.homework.analyze')}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('ai.homework.result')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <section>
                  <h3 className="font-semibold">{t('ai.homework.analysis')}</h3>
                  <p className="text-muted-foreground">{result.analysis}</p>
                </section>
                <section>
                  <h3 className="font-semibold">{t('ai.homework.steps')}</h3>
                  <ol className="list-decimal pl-5 text-muted-foreground">
                    {result.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3 className="font-semibold">{t('ai.homework.answer')}</h3>
                  <p className="font-medium text-primary">{result.answer}</p>
                </section>
                {result.alternativeSolution && (
                  <section>
                    <h3 className="font-semibold">{t('ai.homework.alternative')}</h3>
                    <p className="text-muted-foreground">{result.alternativeSolution}</p>
                  </section>
                )}
                {result.similarQuestions.length > 0 && (
                  <section>
                    <h3 className="font-semibold">{t('ai.homework.similar')}</h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {result.similarQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {history.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('ai.homework.history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {history.map((h) => (
                  <li key={h.id} className="rounded-lg bg-muted/50 px-3 py-2">
                    {h.title ?? 'Homework'} · {new Date(h.updatedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
