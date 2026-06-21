'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn, StitchTutorShell } from '@eduai/ui';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed?: number;
  sources?: Array<{ type: string; id: string; label?: string }>;
}

export interface AiChatProps {
  portal: 'student' | 'teacher' | 'parent';
  subjectId?: string;
  lessonId?: string;
  classLevel?: number;
}

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

export function AiChat({ portal, subjectId, lessonId, classLevel }: AiChatProps) {
  const { data: session } = useSession();
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const useStreaming = true;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !session?.user?.accessToken) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const body = {
      message: text,
      conversationId,
      subjectId,
      lessonId,
      classLevel,
      language: locale,
    };

    try {
      if (useStreaming) {
        setStreaming(true);
        const assistantId = `a-${Date.now()}`;
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        const res = await fetch(`${AI_BASE}/api/v1/tutor/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(body),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = JSON.parse(line.slice(6)) as {
                type: string;
                content?: string;
                conversationId?: string;
                tokensUsed?: number;
                error?: string;
              };
              if (data.type === 'delta' && data.content) {
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m,
                  ),
                );
              } else if (data.type === 'done') {
                if (data.conversationId) setConversationId(data.conversationId);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: fullContent, tokensUsed: data.tokensUsed }
                      : m,
                  ),
                );
              } else if (data.type === 'error') {
                throw new Error(data.error ?? 'Stream error');
              }
            }
          }
        }
        setStreaming(false);
      } else {
        const res = await fetch(`${AI_BASE}/api/v1/tutor/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message ?? 'Chat failed');
        const data = json.data as {
          conversationId: string;
          message: string;
          tokensUsed: number;
          sources?: ChatMessage['sources'];
        };
        setConversationId(data.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.message,
            tokensUsed: data.tokensUsed,
            sources: data.sources,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: err instanceof Error ? err.message : t('common.error'),
        },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [
    input,
    loading,
    session,
    conversationId,
    subjectId,
    lessonId,
    classLevel,
    locale,
    useStreaming,
    t,
  ]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    setInput('');
  }, []);

  return (
    <StitchTutorShell onNewChat={resetChat} className="h-[calc(100vh-8rem)]">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 py-3">
          <p className="font-semibold">{t('ai.tutor.title')}</p>
          <p className="text-sm text-muted-foreground">{t('ai.tutor.subtitle')}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t('ai.tutor.empty')}</p>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-2 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <p className="mt-2 text-xs opacity-70">
                      {t('ai.tutor.sources')}: {msg.sources.map((s) => s.label ?? s.id).join(', ')}
                    </p>
                  )}
                  {msg.tokensUsed !== undefined && (
                    <p className="mt-1 text-xs opacity-60">
                      {msg.tokensUsed} {t('ai.tokens')}
                    </p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {streaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('ai.tutor.typing')}
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={t('ai.tutor.placeholder')}
              disabled={loading}
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon" className="rounded-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </StitchTutorShell>
  );
}
