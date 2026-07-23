'use client';

import * as React from 'react';
import { Bot, Send, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import { Button } from './button';
import { Textarea } from './textarea';

export interface AiTutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  meta?: string;
}

export interface AiTutorChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: AiTutorMessage;
  userLabel?: string;
  assistantLabel?: string;
}

/** Single chat bubble for AI tutor transcripts. */
export function AiTutorChatBubble({
  message,
  userLabel = 'You',
  assistantLabel = 'AI Tutor',
  className,
  ...props
}: AiTutorChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start', className)}
      {...props}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[min(80%,28rem)] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'rounded-ee-md bg-primary text-primary-foreground'
            : 'rounded-es-md bg-muted text-foreground',
        )}
      >
        <p className="sr-only">{isUser ? userLabel : assistantLabel}</p>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.meta && (
          <p className={cn('mt-1 text-xs', isUser ? 'opacity-70' : 'text-muted-foreground')}>
            {message.meta}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-muted">
            <User className="h-4 w-4" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export interface AiTutorComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  sendLabel?: string;
  className?: string;
}

/** Composer row for AI tutor — Enter to send, Shift+Enter for newline. */
export function AiTutorComposer({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask anything about your lesson…',
  disabled,
  loading,
  sendLabel = 'Send message',
  className,
}: AiTutorComposerProps) {
  return (
    <div className={cn('flex items-end gap-2', className)}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && !loading && value.trim()) onSubmit();
          }
        }}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={1}
        className="min-h-[44px] flex-1 resize-none rounded-2xl"
        aria-label={placeholder}
      />
      <Button
        size="icon"
        className="h-11 w-11 shrink-0 rounded-full"
        onClick={onSubmit}
        disabled={disabled || loading || !value.trim()}
        loading={loading}
        loadingLabel={sendLabel}
        aria-label={sendLabel}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
