import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * A single chat bubble. Renders either an AI message (with a bot avatar and
 * timestamp) or an applicant message (right-aligned, red).
 */
export function ChatMessage({ message }) {
  const isAI = message.from === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2.5', !isAI && 'flex-row-reverse')}
    >
      {isAI && (
        <Avatar className="h-8 w-8 shrink-0 border border-border">
          <AvatarFallback className="bg-brand-red/10 text-brand-red">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('max-w-[80%] space-y-1', !isAI && 'text-right')}>
        <div
          className={cn(
            'inline-block rounded-2xl px-3.5 py-2 text-left text-sm leading-relaxed',
            isAI
              ? 'rounded-tl-sm border border-border bg-card text-foreground'
              : 'rounded-tr-sm bg-brand-red text-white'
          )}
        >
          {message.text}
        </div>
        {message.time && (
          <p className="px-1 text-[10px] text-muted-foreground">{message.time}</p>
        )}
      </div>
</motion.div>
  );
}
