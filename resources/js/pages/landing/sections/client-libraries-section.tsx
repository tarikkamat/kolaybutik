import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, FileCode, Github, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Library {
    name: string;
    repo: string;
    description: string;
    link: string;
    icon: typeof FileCode;
    color: string;
}

function SkeletonCard() {
    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-4 h-3 w-32" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function ClientLibrariesSection() {
    const [starCounts, setStarCounts] = useState<Record<string, number | null>>(
        {},
    );
    const [loading, setLoading] = useState(true);

    const libraries: Library[] = [
        {
            name: 'PHP',
            repo: 'iyzipay-php',
            description: 'iyzipay API PHP client',
            link: 'https://github.com/iyzico/iyzipay-php',
            icon: FileCode,
            color: 'indigo',
        },
        {
            name: '.NET',
            repo: 'iyzipay-dotnet',
            description: 'iyzipay API .NET client',
            link: 'https://github.com/iyzico/iyzipay-dotnet',
            icon: Code2,
            color: 'purple',
        },
        {
            name: 'Java',
            repo: 'iyzipay-java',
            description: 'iyzipay API Java client',
            link: 'https://github.com/iyzico/iyzipay-java',
            icon: Package,
            color: 'amber',
        },
        {
            name: 'Node.js',
            repo: 'iyzipay-node',
            description: 'iyzipay API Node.js client',
            link: 'https://github.com/iyzico/iyzipay-node',
            icon: FileCode,
            color: 'emerald',
        },
        {
            name: 'Python',
            repo: 'iyzipay-python',
            description: 'iyzipay API Python client',
            link: 'https://github.com/iyzico/iyzipay-python',
            icon: Code2,
            color: 'blue',
        },
        {
            name: 'Go',
            repo: 'iyzipay-go',
            description: 'iyzipay API Go client',
            link: 'https://github.com/iyzico/iyzipay-go',
            icon: Package,
            color: 'rose',
        },
    ];

    useEffect(() => {
        const fetchStarCounts = async () => {
            try {
                const response = await fetch('/api/github-stars');
                if (response.ok) {
                    const data = await response.json();
                    setStarCounts(data);
                } else {
                    // Fallback: Set all to null if API fails
                    const counts: Record<string, number | null> = {};
                    libraries.forEach((lib) => {
                        counts[lib.repo] = null;
                    });
                    setStarCounts(counts);
                }
            } catch (error) {
                console.error('Error fetching GitHub stars:', error);
                // Fallback: Set all to null on error
                const counts: Record<string, number | null> = {};
                libraries.forEach((lib) => {
                    counts[lib.repo] = null;
                });
                setStarCounts(counts);
            } finally {
                setLoading(false);
            }
        };

        fetchStarCounts();
    }, []);

    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-100 dark:bg-indigo-950',
            icon: 'text-indigo-600 dark:text-indigo-400',
            border: 'border-indigo-200 dark:border-indigo-800',
        },
        purple: {
            bg: 'bg-purple-100 dark:bg-purple-950',
            icon: 'text-purple-600 dark:text-purple-400',
            border: 'border-purple-200 dark:border-purple-800',
        },
        amber: {
            bg: 'bg-amber-100 dark:bg-amber-950',
            icon: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800',
        },
        emerald: {
            bg: 'bg-emerald-100 dark:bg-emerald-950',
            icon: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-200 dark:border-emerald-800',
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-950',
            icon: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-200 dark:border-blue-800',
        },
        rose: {
            bg: 'bg-rose-100 dark:bg-rose-950',
            icon: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-200 dark:border-rose-800',
        },
    };

    const formatStarCount = (count: number | null | undefined): string => {
        if (count === null || count === undefined) return '—';
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    return (
        <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        Client Kütüphaneleri
                    </h2>
                    <p className="mb-4 text-lg text-slate-600 dark:text-slate-400">
                        Açık kaynak SDK'lar ile hızlı entegrasyon
                    </p>
                    <a
                        href="https://github.com/iyzico"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        <Github className="h-5 w-5" />
                        <span>Tüm kütüphaneleri GitHub'da görüntüle</span>
                    </a>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? // Show skeleton loaders while loading
                          libraries.map((_, index) => (
                              <SkeletonCard key={index} />
                          ))
                        : // Show actual cards when loaded
                          libraries.map((library, index) => {
                              const Icon = library.icon;
                              const colors =
                                  colorClasses[
                                      library.color as keyof typeof colorClasses
                                  ];
                              const starCount = starCounts[library.repo];
                              const displayStars = formatStarCount(starCount);

                              return (
                                  <a
                                      key={index}
                                      href={library.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <Card
                                          className={`border-slate-200 transition-all hover:scale-105 hover:shadow-lg dark:border-slate-800 ${colors.border}`}
                                      >
                                          <CardHeader>
                                              <div className="mb-4 flex items-center justify-between">
                                                  <div
                                                      className={`inline-flex rounded-lg p-3 ${colors.bg}`}
                                                  >
                                                      <Icon
                                                          className={`h-6 w-6 ${colors.icon}`}
                                                      />
                                                  </div>
                                                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                      <Github className="h-4 w-4" />
                                                      <span>
                                                          {displayStars}
                                                      </span>
                                                  </div>
                                              </div>
                                              <CardTitle className="text-slate-900 dark:text-white">
                                                  {library.name}
                                              </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                                                  {library.description}
                                              </p>
                                              <p className="text-xs text-slate-500 dark:text-slate-500">
                                                  {library.repo}
                                              </p>
                                          </CardContent>
                                      </Card>
                                  </a>
                              );
                          })}
                </div>
            </div>
        </section>
    );
}
