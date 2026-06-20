'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Input } from './input';
import { Label } from './label';

export type QuizQuestionType = 'mcq' | 'multi_select' | 'true_false' | 'fill_blank';

export interface QuizQuestionProps {
  type: QuizQuestionType;
  question: string;
  options?: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  hint?: string;
  questionNumber?: number;
  totalQuestions?: number;
  trueLabel?: string;
  falseLabel?: string;
  fillBlankPlaceholder?: string;
  className?: string;
}

function toggleMultiSelect(current: string[], option: string): string[] {
  return current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option];
}

export function QuizQuestion({
  type,
  question,
  options = [],
  value,
  onChange,
  disabled = false,
  hint,
  questionNumber,
  totalQuestions,
  trueLabel = 'True',
  falseLabel = 'False',
  fillBlankPlaceholder = 'Type your answer…',
  className,
}: QuizQuestionProps) {
  const multiValue = Array.isArray(value) ? value : [];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        {questionNumber != null && totalQuestions != null && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
        )}
        <p className="text-lg font-medium leading-relaxed">{question}</p>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>

      {type === 'fill_blank' && (
        <Input
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={fillBlankPlaceholder}
          disabled={disabled}
          aria-label="Your answer"
        />
      )}

      {type === 'true_false' && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={question}>
          {[trueLabel, falseLabel].map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => onChange?.(option)}
                className={cn(
                  'rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors',
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {(type === 'mcq' || type === 'multi_select') && (
        <div
          className="space-y-2"
          role={type === 'mcq' ? 'radiogroup' : 'group'}
          aria-label={question}
        >
          {type === 'multi_select' && (
            <p className="text-xs text-muted-foreground">Select all that apply</p>
          )}
          {options.map((option) => {
            const selected =
              type === 'mcq' ? value === option : multiValue.includes(option);

            return (
              <button
                key={option}
                type="button"
                role={type === 'mcq' ? 'radio' : 'checkbox'}
                aria-checked={selected}
                disabled={disabled}
                onClick={() => {
                  if (type === 'mcq') {
                    onChange?.(option);
                    return;
                  }
                  onChange?.(toggleMultiSelect(multiValue, option));
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center border',
                    type === 'mcq' ? 'rounded-full' : 'rounded-sm',
                    selected ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                  )}
                  aria-hidden="true"
                >
                  {selected && (
                    <span
                      className={cn(
                        'bg-primary-foreground',
                        type === 'mcq' ? 'h-2 w-2 rounded-full' : 'h-2 w-2 rounded-sm',
                      )}
                    />
                  )}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
