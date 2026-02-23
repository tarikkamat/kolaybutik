import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

/**
 * Cleans the message content by removing <think> tags
 */
export function cleanMessage(content: string): string {
    // Remove <think>...</think> tags and their content
    return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

/**
 * Converts markdown to React elements using react-markdown
 */
export function renderMarkdown(content: string): React.ReactNode {
    // First clean the content
    const cleaned = cleanMessage(content);

    return (
        <ReactMarkdown
            components={{
                // Headings
                h1: ({ children }) => (
                    <h1 className="mb-2 mt-4 text-xl font-semibold first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="mb-2 mt-4 text-lg font-semibold first:mt-0">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="mb-2 mt-3 text-sm font-semibold first:mt-0">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="mb-2 mt-3 text-sm font-semibold first:mt-0">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="mb-2 mt-3 text-sm font-semibold first:mt-0">
                        {children}
                    </h6>
                ),
                // Paragraphs
                p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                ),
                // Links
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        {children}
                    </a>
                ),
                // Lists
                ul: ({ children }) => (
                    <ul className="ml-4 mt-2 list-disc space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="ml-4 mt-2 list-decimal space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li className="ml-2">{children}</li>,
                // Code blocks
                code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                        <code
                            className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700"
                            {...props}
                        >
                            {children}
                        </code>
                    ) : (
                        <code
                            className={cn(
                                'block rounded bg-slate-100 p-3 text-xs dark:bg-slate-800',
                                className
                            )}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => (
                    <pre className="mb-2 overflow-x-auto rounded bg-slate-100 p-3 dark:bg-slate-800">
                        {children}
                    </pre>
                ),
                // Blockquotes
                blockquote: ({ children }) => (
                    <blockquote className="my-2 border-l-4 border-slate-300 pl-4 italic dark:border-slate-600">
                        {children}
                    </blockquote>
                ),
                // Horizontal rule
                hr: () => <hr className="my-4 border-slate-200 dark:border-slate-700" />,
                // Strong (bold)
                strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                ),
                // Emphasis (italic)
                em: ({ children }) => <em className="italic">{children}</em>,
            }}
        >
            {cleaned}
        </ReactMarkdown>
    );
}
