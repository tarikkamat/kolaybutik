import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Download,
    Eye,
    File,
    Folder,
    RefreshCw,
    Server,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SftpItem {
    type: 'file' | 'dir';
    path: string;
    name: string;
    size: number | null;
    lastModified: number | null;
}

interface SftpIndexProps {
    sftpContents?: SftpItem[] | null;
    sftpPath?: string | null;
    sftpError?: string | null;
    sftpFileContent?: string | null;
    sftpFilePath?: string | null;
    sftpFileError?: string | null;
}

export default function SftpIndex({
    sftpContents: propSftpContents = null,
    sftpPath: propSftpPath = null,
    sftpError: propSftpError = null,
    sftpFileContent: propSftpFileContent = null,
    sftpFilePath: propSftpFilePath = null,
    sftpFileError: propSftpFileError = null,
}: SftpIndexProps) {
    const [currentPath, setCurrentPath] = useState(propSftpPath || '/');
    const [items, setItems] = useState<SftpItem[]>(propSftpContents || []);
    const [error, setError] = useState<string | null>(propSftpError || null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{
        path: string;
        content: string;
    } | null>(
        propSftpFileContent && propSftpFilePath
            ? { path: propSftpFilePath, content: propSftpFileContent }
            : null,
    );
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
    const hasInitialized = useRef(false);

    const listDirectory = (path: string = currentPath) => {
        setIsLoading(true);
        setError(null);
        router.get(
            '/services/sftp/list',
            { path },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: (errors) => {
                    setError(
                        Object.values(errors).join(', ') || 'Bir hata oluştu',
                    );
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    useEffect(() => {
        // Update state when props change
        if (propSftpContents) {
            setItems(propSftpContents);
        }
        if (propSftpPath) {
            setCurrentPath(propSftpPath);
        }
        if (propSftpError) {
            setError(propSftpError);
        }
        if (propSftpFileContent && propSftpFilePath) {
            setSelectedFile({
                path: propSftpFilePath,
                content: propSftpFileContent,
            });
            setIsFileDialogOpen(true);
        }
        if (propSftpFileError) {
            setError(propSftpFileError);
        }
    }, [
        propSftpContents,
        propSftpPath,
        propSftpError,
        propSftpFileContent,
        propSftpFilePath,
        propSftpFileError,
    ]);

    useEffect(() => {
        // Only run once on mount if no initial data
        if (!hasInitialized.current && !propSftpContents) {
            hasInitialized.current = true;
            listDirectory('/');
        } else {
            hasInitialized.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatSize = (bytes: number | null): string => {
        if (bytes === null) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatDate = (timestamp: number | null): string => {
        if (timestamp === null) return '-';
        return new Date(timestamp * 1000).toLocaleString('tr-TR');
    };

    const handleItemClick = (item: SftpItem) => {
        if (item.type === 'dir') {
            listDirectory(item.path);
        }
    };

    const handleBack = () => {
        const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
        listDirectory(parentPath);
    };

    const handleReadFile = (path: string) => {
        setIsLoading(true);
        setError(null);
        router.get(
            '/services/sftp/read',
            { path },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: (errors) => {
                    setError(
                        Object.values(errors).join(', ') || 'Dosya okunamadı',
                    );
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const handleDownloadFile = (path: string) => {
        // Direct download using window.location for binary files
        const url = `/services/sftp/download?remotePath=${encodeURIComponent(path)}`;
        window.location.href = url;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="SFTP Client" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-4">
                        <Link href="/services">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Geri Dön
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
                                <Server className="h-8 w-8 text-indigo-600" />
                                SFTP Client
                            </h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                SFTP sunucusundaki dosyaları görüntüleyin ve
                                indirin
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => listDirectory()}
                                disabled={isLoading}
                            >
                                <RefreshCw
                                    className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                />
                                Yenile
                            </Button>
                            {currentPath !== '/' && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                >
                                    Geri
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-200">
                            {error}
                        </span>
                    </div>
                )}

                {/* Connection Status */}
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                            Bağlı - {currentPath}
                        </span>
                    </div>
                </div>

                {/* File List */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        İsim
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Tip
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Boyut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Son Değişiklik
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {items.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {item.type === 'dir' ? (
                                                    <Folder className="h-5 w-5 text-blue-500" />
                                                ) : (
                                                    <File className="h-5 w-5 text-slate-400" />
                                                )}
                                                <span
                                                    className={`text-sm font-medium text-slate-900 dark:text-white ${
                                                        item.type === 'dir'
                                                            ? 'cursor-pointer hover:underline'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        item.type === 'dir' &&
                                                        handleItemClick(item)
                                                    }
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {item.type === 'dir'
                                                    ? 'Klasör'
                                                    : 'Dosya'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {formatSize(item.size)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {formatDate(item.lastModified)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            {item.type === 'file' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleReadFile(
                                                                item.path,
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDownloadFile(
                                                                item.path,
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {items.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                Klasör boş
                            </div>
                        )}
                        {isLoading && (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                Yükleniyor...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* File Content Dialog */}
            <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>{selectedFile?.path}</DialogTitle>
                        <DialogDescription>Dosya içeriği</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-900">
                            <code>{selectedFile?.content}</code>
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
