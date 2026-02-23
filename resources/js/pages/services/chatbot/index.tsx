import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ChatbotSidebar from '@/components/chatbot/chatbot-sidebar';

export default function ChatbotPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Chatbot" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/services"
                        className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Servislere Geri Dön
                    </Link>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                        Chatbot
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        AI destekli chatbot ile sorularınızı sorun ve anında cevap alın
                    </p>
                </div>

                {/* Chatbot Container */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="h-[600px] overflow-hidden">
                        <ChatbotSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
