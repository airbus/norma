import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { MessageSquare, Send, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useProject } from '@/hooks/use-project';
import { api, type ChatMessage, type ChatSession } from '@/lib/api';
import { SUGGESTED_QUESTIONS } from '@/data/mock';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
        <MessageSquare className="text-muted-foreground size-4" />
      </div>
      <div className="py-3">
        <div className="flex gap-1">
          <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:0ms]" />
          <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:150ms]" />
          <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentProject } = useProject();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  const initialSentRef = useRef(false);

  useEffect(() => {
    if (shouldScrollRef.current && lastUserMsgRef.current) {
      shouldScrollRef.current = false;
      requestAnimationFrame(() => {
        lastUserMsgRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  }, [messages]);

  const createSession = useCallback(async () => {
    if (!currentProject) return null;
    try {
      const newSession = await api.post<ChatSession>('/chat/sessions', {
        project_id: currentProject.id,
      });
      setSession(newSession);
      setMessages([]);
      return newSession;
    } catch {
      return null;
    }
  }, [currentProject]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping || !currentProject) return;

      let currentSession = session;
      if (!currentSession) {
        currentSession = await createSession();
        if (!currentSession) return;
      }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);
      setAwaitingReply(true);
      shouldScrollRef.current = true;

      const streamingMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      };

      try {
        const token = localStorage.getItem('norma-token');
        const res = await fetch(`/api/chat/sessions/${currentSession.id}/messages/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content: text.trim() }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = '';
        let started = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const events = sseBuffer.split('\n\n');
          sseBuffer = events.pop() ?? '';

          for (const event of events) {
            const trimmed = event.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const raw = trimmed.slice(6);
            if (raw === '[DONE]') continue;

            try {
              streamingMsg.content += JSON.parse(raw);
            } catch {
              streamingMsg.content += raw;
            }

            if (!started) {
              started = true;
              setIsTyping(false);
              setMessages((prev) => [...prev, { ...streamingMsg }]);
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === streamingMsg.id ? { ...streamingMsg } : m)),
              );
            }
            await new Promise((r) => requestAnimationFrame(r));
          }
        }
      } catch {
        if (streamingMsg.content) {
          setMessages((prev) =>
            prev.map((m) => (m.id === streamingMsg.id ? { ...streamingMsg } : m)),
          );
        } else {
          const errorMsg: ChatMessage = {
            id: streamingMsg.id,
            role: 'assistant',
            content: "I'm sorry, I encountered an error processing your request. Please try again.",
            created_at: new Date().toISOString(),
          };
          setMessages((prev) =>
            streamingMsg.content === ''
              ? [...prev, errorMsg]
              : prev.map((m) => (m.id === streamingMsg.id ? errorMsg : m)),
          );
        }
      } finally {
        setIsTyping(false);
        setAwaitingReply(false);
      }
    },
    [isTyping, currentProject, session, createSession],
  );

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialSentRef.current) {
      initialSentRef.current = true;
      setSearchParams({}, { replace: true });
      sendMessage(q);
    }
  }, [searchParams, setSearchParams, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleNewChat = () => {
    setSession(null);
    setMessages([]);
    setIsTyping(false);
    initialSentRef.current = false;
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-svh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-base font-medium">Chat</h1>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto cursor-pointer"
          onClick={handleNewChat}
        >
          <SquarePen className="mr-1 size-4" />
          New chat
        </Button>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b to-transparent" />
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t to-transparent" />
        <ScrollArea className="h-full" ref={scrollRef}>
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-24">
              <div className="bg-primary/10 mb-6 flex size-16 items-center justify-center rounded-2xl">
                <MessageSquare className="text-primary size-8" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold">Hi, I'm Norma! How can I help you?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg text-center text-sm">
                Ask me about EU AI Act compliance, your project's risk classification, or any
                regulatory questions.
              </p>
              <div className="flex max-w-lg flex-col items-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="hover:bg-accent cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`mx-auto max-w-3xl space-y-6 px-4 pt-8 ${awaitingReply ? 'pb-[50vh]' : 'pb-4'}`}
            >
              {(() => {
                const lastUserIdx = messages.findLastIndex((m) => m.role === 'user');
                return messages.map((msg, idx) =>
                  msg.role === 'user' ? (
                    <div
                      key={msg.id}
                      ref={idx === lastUserIdx ? lastUserMsgRef : undefined}
                      className="scroll-mt-10 flex justify-end"
                    >
                      <div className="bg-muted max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="bg-muted mt-1 flex size-8 shrink-0 items-center justify-center rounded-full">
                        <MessageSquare className="text-muted-foreground size-4" />
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none flex-1 text-foreground">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  ),
                );
              })()}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-4">
        <div className="mx-auto max-w-3xl">
          <div className="bg-muted/50 flex items-center gap-2 rounded-full border px-4 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Norma"
              rows={1}
              className="placeholder:text-muted-foreground flex-1 resize-none bg-transparent py-1 text-sm outline-none"
            />
            <Button
              size="icon"
              variant="ghost"
              className="size-8 shrink-0 cursor-pointer"
              disabled={!input.trim() || isTyping}
              onClick={() => sendMessage(input)}
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Norma can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
