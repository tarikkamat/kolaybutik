import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

interface QuickDemoFailedProps {
    error?: string;
    errorMessage?: string;
}

export default function QuickDemoFailed({
    error,
    errorMessage,
}: QuickDemoFailedProps) {
    const displayError = error || errorMessage || 'Bilinmeyen bir hata oluştu.';

    return (
        <>
            <Head title="Demo Ödeme Başarısız" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                            Demo Ödeme Başarısız
                        </h1>
                        <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                            Ödeme işlemi sırasında bir hata oluştu.
                        </p>
                        {displayError && (
                            <p className="mb-8 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                {displayError}
                            </p>
                        )}

                        <div className="mb-8 rounded-lg bg-slate-50 p-6 dark:bg-slate-900/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Bu bir demo ödeme işlemidir. Lütfen bilgilerinizi
                                kontrol edip tekrar deneyin.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link href="/demo/credit-card">
                                <Button className="w-full sm:w-auto">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Tekrar Dene
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
