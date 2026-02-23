import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface QuickDemoButtonProps {
    href: string;
    color?: 'indigo' | 'emerald' | 'amber';
    children?: React.ReactNode;
}

export function QuickDemoButton({
    href,
    color = 'indigo',
    children = 'Hızlı Dene',
}: QuickDemoButtonProps) {
    const colorClasses = {
        indigo: {
            button:
                'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
        emerald: {
            button:
                'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
        amber: {
            button:
                'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
    };

    const classes = colorClasses[color];

    return (
        <>
            <style>{`
                @keyframes pulse-glow-kaamaru {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(30, 20, 110, 0.7);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(30, 20, 110, 0);
                        transform: scale(1.02);
                    }
                }
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .animate-pulse-glow-kaamaru {
                    animation: pulse-glow-kaamaru 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-shimmer-kaamaru {
                    background: linear-gradient(
                        90deg,
                        rgba(30, 20, 110, 0.1) 0%,
                        rgba(30, 20, 110, 0.4) 50%,
                        rgba(30, 20, 110, 0.1) 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 3s linear infinite;
                }
            `}</style>
            <Link href={href}>
                <Button
                    className={`w-full ${classes.button} hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                    variant="outline"
                >
                    <span className="relative z-10 text-white">{children}</span>
                    <span className={`absolute inset-0 ${classes.shimmer}`}></span>
                </Button>
            </Link>
        </>
    );
}
