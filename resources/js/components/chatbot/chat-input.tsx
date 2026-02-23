import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Mesajınızı yazın...',
}: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage && !disabled) {
            onSend(trimmedMessage);
            setMessage('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex gap-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className={cn(
                        'min-h-[44px] max-h-32 resize-none',
                        'focus-visible:ring-2 focus-visible:ring-indigo-500'
                    )}
                />
                <Button
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    size="icon"
                    className="h-11 w-11 shrink-0"
                >
                    {disabled ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Enter ile gönder, Shift+Enter ile yeni satır
            </p>
        </div>
    );
}
