import {
    ChevronDown,
    ChevronUp,
    Clock,
    FileText,
    Globe,
    User,
} from 'lucide-react';
import { WebhookData } from '../types';
import { formatJson, formatTimestamp } from '../utils';

interface WebhookCardProps {
    webhook: WebhookData;
    index: number;
    isExpanded: boolean;
    onToggle: (index: number) => void;
}

export function WebhookCard({
    webhook,
    index,
    isExpanded,
    onToggle,
}: WebhookCardProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div
                className="cursor-pointer border-b border-slate-200 bg-slate-50 px-6 py-4 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                onClick={() => onToggle(index)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                webhook.method === 'POST'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                        >
                            {webhook.method}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            {formatTimestamp(webhook.timestamp)}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Globe className="h-4 w-4" />
                            {webhook.ip}
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="space-y-4 p-6">
                    {/* User Agent */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                User Agent
                            </span>
                        </div>
                        <p className="rounded bg-slate-50 p-2 font-mono text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                            {webhook.user_agent}
                        </p>
                    </div>

                    {/* Headers */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Headers
                            </span>
                        </div>
                        <pre className="overflow-x-auto rounded bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                            {formatJson(webhook.headers)}
                        </pre>
                    </div>

                    {/* Body */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Body
                            </span>
                        </div>
                        <pre className="overflow-x-auto rounded bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                            {formatJson(webhook.body)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
