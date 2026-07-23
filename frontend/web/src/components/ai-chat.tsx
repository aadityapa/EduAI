'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  AiTutorChatBubble,
  AiTutorComposer,
  EmptyState,
  Spinner,
  StitchTutorShell,
} from '@eduai/ui';
import { Bot } from 'lucide-react';
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
  const shouldReduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const useStreaming = true;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [messages, streaming, shouldReduceMotion]);

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

  void portal;

  return (
    <StitchTutorShell onNewChat={resetChat} className="h-[calc(100vh-8rem)]">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 py-3">
          <p className="font-semibold">{t('ai.tutor.title')}</p>
          <p className="text-sm text-muted-foreground">{t('ai.tutor.subtitle')}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <EmptyState
              icon={<Bot className="h-5 w-5" />}
              title={t('ai.tutor.empty')}
              description={t('ai.tutor.subtitle')}
              className="border-0 bg-transparent"
            />
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const metaParts: string[] = [];
              if (msg.sources && msg.sources.length > 0) {
                metaParts.push(
                  `${t('ai.tutor.sources')}: ${msg.sources.map((s) => s.label ?? s.id).join(', ')}`,
                );
              }
              if (msg.tokensUsed !== undefined) {
                metaParts.push(`${msg.tokensUsed} ${t('ai.tokens')}`);
              }
              return (
                <motion.div
                  key={msg.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <AiTutorChatBubble
                    message={{
                      id: msg.id,
                      role: msg.role,
                      content: msg.content || (streaming && msg.role === 'assistant' ? '…' : ''),
                      meta: metaParts.length ? metaParts.join(' · ') : undefined,
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {streaming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner size="sm" />
              {t('ai.tutor.typing')}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <AiTutorComposer
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          placeholder={t('ai.tutor.placeholder')}
          disabled={loading}
          loading={loading}
          className="border-t p-4"
        />
      </div>
    </StitchTutorShell>
  );
}
