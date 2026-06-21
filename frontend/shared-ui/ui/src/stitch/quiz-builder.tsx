'use client';

import { useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from '../components/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card';
import { Input } from '../components/input';
import { Label } from '../components/label';

const STEPS = ['Configure', 'Review', 'Finalize'] as const;

export function StitchQuizBuilderWizard({ aiGeneratorHref }: { aiGeneratorHref: string }) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questionCount, setQuestionCount] = useState('10');

  return (
    <div className="space-y-6">
      <nav className="flex border-b border-border">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'relative px-6 py-3 text-sm font-medium transition-colors',
              step === i ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {step === i && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {step === 0 && (
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Quiz Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chapter 5 Assessment" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-subject">Subject</Label>
                  <Input id="quiz-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-count">Number of Questions</Label>
                  <Input id="quiz-count" type="number" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} />
                </div>
                <div className="rounded-xl border border-[#9334E6]/20 bg-[#9334E6]/5 p-4">
                  <p className="text-sm font-semibold text-[#9334E6]">AI Assist</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Generate questions automatically from your lesson content.
                  </p>
                  <Button asChild variant="outline" className="mt-3">
                    <a href={aiGeneratorHref}>Open AI Generator</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Review Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-xl border p-4">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Question {n}</p>
                    <p className="mt-1 font-medium">Sample MCQ — edit after generating with AI</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Finalize & Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Review settings, assign to a class, and publish when ready.
                </p>
                <div className="rounded-xl bg-muted p-4 text-sm">
                  <p><strong>Title:</strong> {title || 'Untitled Quiz'}</p>
                  <p><strong>Subject:</strong> {subject || '—'}</p>
                  <p><strong>Questions:</strong> {questionCount}</p>
                </div>
                <Button className="rounded-full" disabled>
                  Publish Quiz (connect backend)
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          </div>
        </div>

        <Card className="stitch-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border bg-muted/50 p-4">
              <p className="text-lg font-bold">{title || 'Quiz Title'}</p>
              <p className="text-sm text-muted-foreground">{subject || 'Subject'} · {questionCount} questions</p>
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-3/4 rounded-full bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
