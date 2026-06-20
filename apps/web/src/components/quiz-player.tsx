'use client';

import { useMemo, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, QuizQuestion } from '@eduai/ui';
import type { Quiz, QuizQuestionData } from '@/lib/learning-api';
import { startQuizAttemptAction, submitQuizAttemptAction } from '@/lib/learning-actions';

interface QuizPlayerProps {
  quiz: Quiz;
}

function buildOptionMaps(question: QuizQuestionData) {
  const labelToId = new Map<string, string>();
  const idToLabel = new Map<string, string>();
  for (const option of question.options) {
    labelToId.set(option.label, option.id);
    idToLabel.set(option.id, option.label);
  }
  return { labelToId, idToLabel, labels: question.options.map((o) => o.label) };
}

function toSubmitAnswer(question: QuizQuestionData, value: string | string[] | undefined) {
  if (value === undefined) return undefined;
  const { labelToId } = buildOptionMaps(question);

  if (question.type === 'multi_select') {
    const selected = Array.isArray(value) ? value : [value];
    return selected.map((label) => labelToId.get(label) ?? label);
  }

  if (question.type === 'mcq' || question.type === 'true_false') {
    const label = String(value);
    return labelToId.get(label) ?? label;
  }

  return value;
}

function toDisplayValue(
  question: QuizQuestionData,
  stored: string | string[] | undefined,
): string | string[] | undefined {
  if (stored === undefined) return undefined;
  const { idToLabel } = buildOptionMaps(question);

  if (question.type === 'multi_select') {
    const ids = Array.isArray(stored) ? stored : [stored];
    return ids.map((id) => idToLabel.get(id) ?? id);
  }

  if (question.type === 'mcq' || question.type === 'true_false') {
    const id = String(stored);
    return idToLabel.get(id) ?? id;
  }

  return stored;
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitQuizAttemptAction>> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [startedAt] = useState(() => Date.now());

  const questions = useMemo(
    () => [...quiz.questions].sort((a, b) => a.sortOrder - b.sortOrder),
    [quiz.questions],
  );
  const current = questions[currentIndex];

  const startQuiz = () => {
    setError(null);
    startTransition(async () => {
      try {
        const attempt = await startQuizAttemptAction(quiz.id);
        setAttemptId(attempt.attemptId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not start quiz');
      }
    });
  };

  const submitQuiz = () => {
    if (!attemptId) return;
    setError(null);
    startTransition(async () => {
      try {
        const payload: Record<string, unknown> = {};
        for (const question of questions) {
          const answer = toSubmitAnswer(question, answers[question.id]);
          if (answer !== undefined) {
            payload[question.id] = answer;
          }
        }
        const timeSpent = Math.round((Date.now() - startedAt) / 1000);
        const submitResult = await submitQuizAttemptAction(attemptId, {
          answers: payload,
          timeSpent,
        });
        setResult(submitResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not submit quiz');
      }
    });
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{result.passed ? 'Great job!' : 'Keep practicing'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{Math.round(result.score)}%</p>
            <p className="text-sm text-muted-foreground">
              {result.passed ? 'You passed this quiz.' : `Passing score: ${quiz.passingScore}%`}
            </p>
            <p className="text-sm">
              {result.evaluation.earnedMarks} / {result.evaluation.totalMarks} marks
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!attemptId) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {questions.length} questions · Passing score {quiz.passingScore}%
            {quiz.timeLimitMinutes ? ` · ${quiz.timeLimitMinutes} min limit` : ''}
          </p>
          <Button onClick={startQuiz} disabled={pending}>
            {pending ? 'Starting…' : 'Start quiz'}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  if (!current) return null;

  const optionMaps = buildOptionMaps(current);
  const displayValue = toDisplayValue(current, answers[current.id]);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <QuizQuestion
                type={current.type}
                question={current.stem}
                options={optionMaps.labels}
                value={displayValue}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [current.id]: value as string | string[] }))
                }
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                trueLabel="True"
                falseLabel="False"
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={currentIndex === 0 || pending}
          onClick={() => setCurrentIndex((index) => index - 1)}
        >
          Back
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex((index) => index + 1)} disabled={pending}>
            Next
          </Button>
        ) : (
          <Button onClick={submitQuiz} disabled={pending}>
            {pending ? 'Submitting…' : 'Submit quiz'}
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
