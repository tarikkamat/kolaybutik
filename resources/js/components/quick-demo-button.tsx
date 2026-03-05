import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { Link } from '@inertiajs/react';

interface QuickDemoButtonProps {
    href: string;
    color?: 'indigo' | 'emerald' | 'amber';
    children?: React.ReactNode;
}

export function QuickDemoButton({
    href,
    color = 'indigo',
    children,
}: QuickDemoButtonProps) {
    const { t } = useI18n();

    const colorClasses = {
        indigo: {
            button: 'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
        emerald: {
            button: 'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
        amber: {
            button: 'animate-pulse-glow-kaamaru border-[color:var(--button-border)] bg-[color:var(--button-bg)] text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)] hover:text-[color:var(--button-text)]',
            shimmer: 'animate-shimmer-kaamaru',
        },
    };

    const classes = colorClasses[color];
    const label = children ?? t('common.tryNow');

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
                    className={`w-full ${classes.button} relative overflow-hidden transition-all duration-300 hover:shadow-lg`}
                    variant="outline"
                >
                    <span className="relative z-10 text-white">{label}</span>
                    <span
                        className={`absolute inset-0 ${classes.shimmer}`}
                    ></span>
                </Button>
            </Link>
        </>
    );
}
