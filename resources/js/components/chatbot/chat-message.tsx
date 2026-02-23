import { ChatMessage } from './types';
import { Bot, User } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { renderMarkdown } from './markdown-renderer';

interface ChatMessageProps {
    message: ChatMessage;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isSending = message.status === 'sending';

    return (
        <div
            className={cn(
                'flex w-full gap-3 px-4 py-3',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
            )}

            <div
                className={cn(
                    'flex max-w-[80%] flex-col gap-1 rounded-lg px-4 py-2',
                    isUser
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                )}
            >
                {isSending ? (
                    <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        <span className="text-sm opacity-70">Düşünüyor...</span>
                    </div>
                ) : (
                    <div className="text-sm leading-relaxed">
                        {renderMarkdown(message.content)}
                    </div>
                )}
                <span
                    className={cn(
                        'text-xs',
                        isUser
                            ? 'text-indigo-100'
                            : 'text-slate-500 dark:text-slate-400'
                    )}
                >
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>

            {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
            )}
        </div>
    );
}
