import { Button } from '@/components/ui/button';
import { Trash2, Bot, User } from 'lucide-react';

interface ChatHeaderProps {
    onClear: () => void;
    onProfileClick: () => void;
    title?: string;
}

export default function ChatHeader({
    onClear,
    onProfileClick,
    title = 'Chatbot',
}: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 pr-12 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onProfileClick}
                    className="h-8 w-8"
                    title="Profil bilgilerini düzenle"
                >
                    <User className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="h-8 w-8"
                    title="Sohbeti temizle"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
