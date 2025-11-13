import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function NavigationSection() {
    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            iyzico
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#">
                            <Button variant="ghost">Giriş Yap</Button>
                        </Link>
                        <a
                            href="https://www.iyzico.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button>Hesap Oluştur</Button>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
