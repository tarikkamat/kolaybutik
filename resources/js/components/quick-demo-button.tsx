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
            button: 'animate-pulse-glow-indigo border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white',
            shimmer: 'animate-shimmer-indigo',
        },
        emerald: {
            button: 'animate-pulse-glow-emerald border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white',
            shimmer: 'animate-shimmer-emerald',
        },
        amber: {
            button: 'animate-pulse-glow-amber border-amber-600 bg-amber-600 text-white hover:bg-amber-700 hover:text-white',
            shimmer: 'animate-shimmer-amber',
        },
    };

    const classes = colorClasses[color];

    return (
        <>
            <style>{`
                @keyframes pulse-glow-indigo {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
                        transform: scale(1.02);
                    }
                }
                @keyframes pulse-glow-emerald {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
                        transform: scale(1.02);
                    }
                }
                @keyframes pulse-glow-amber {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
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
                .animate-pulse-glow-indigo {
                    animation: pulse-glow-indigo 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-pulse-glow-emerald {
                    animation: pulse-glow-emerald 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-pulse-glow-amber {
                    animation: pulse-glow-amber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-shimmer-indigo {
                    background: linear-gradient(
                        90deg,
                        rgba(99, 102, 241, 0.1) 0%,
                        rgba(99, 102, 241, 0.4) 50%,
                        rgba(99, 102, 241, 0.1) 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 3s linear infinite;
                }
                .animate-shimmer-emerald {
                    background: linear-gradient(
                        90deg,
                        rgba(16, 185, 129, 0.1) 0%,
                        rgba(16, 185, 129, 0.4) 50%,
                        rgba(16, 185, 129, 0.1) 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 3s linear infinite;
                }
                .animate-shimmer-amber {
                    background: linear-gradient(
                        90deg,
                        rgba(245, 158, 11, 0.1) 0%,
                        rgba(245, 158, 11, 0.4) 50%,
                        rgba(245, 158, 11, 0.1) 100%
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

