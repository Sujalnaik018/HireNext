import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, RotateCcw, Sparkles } from 'lucide-react';

import { ChatInput } from '@/components/applicant/ai-resume/chat-input';
import { ChatMessage } from '@/components/applicant/ai-resume/chat-message';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Left panel — the AI Resume Assistant chat interface.
 * Shows the header, scrollable message list with a typing indicator,
 * a "Start Over" action, and the message input.
 */
export function ChatWindow({ messages, isTyping, onSend, onStartOver }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border bg-background/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              AI Resume Assistant
            </h2>
            <p className="text-xs text-muted-foreground">
              Let's build your professional resume together.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartOver}
          className="text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start Over
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="space-y-4 p-5">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-brand-red"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-background/40 p-4">
        <ChatInput onSend={onSend} disabled={isTyping} />
      </div>
</div>
  );
}
