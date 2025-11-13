<?php

namespace App\Services\Service;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SftpService
{
    /**
     * Check if SFTP configuration is valid
     */
    private function checkConfiguration(): void
    {
        $host = Config::get('filesystems.disks.sftp.host');
        $username = Config::get('filesystems.disks.sftp.username');
        $password = Config::get('filesystems.disks.sftp.password');

        if (empty($host) || empty($username) || empty($password)) {
            throw new \RuntimeException(
                'SFTP bağlantı ayarları eksik. Lütfen .env dosyasında SFTP_HOST, SFTP_USERNAME ve SFTP_PASSWORD değerlerini tanımlayın.'
            );
        }
    }

    /**
     * List directory contents
     */
    public function listDirectory(string $path = '/'): array
    {
        try {
            $this->checkConfiguration();

            $disk = Storage::disk('sftp');

            $items = [];

            // Get directories
            try {
                $directories = $disk->directories($path);
                foreach ($directories as $dir) {
                    try {
                        $items[] = [
                            'type' => 'dir',
                            'path' => $dir,
                            'name' => basename($dir),
                            'size' => null,
                            'lastModified' => $disk->lastModified($dir),
                        ];
                    } catch (\Exception $e) {
                        // Skip if we can't get metadata for this directory
                        $items[] = [
                            'type' => 'dir',
                            'path' => $dir,
                            'name' => basename($dir),
                            'size' => null,
                            'lastModified' => null,
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::warning('SFTP directories listing failed', [
                    'path' => $path,
                    'error' => $e->getMessage(),
                ]);
            }

            // Get files
            try {
                $files = $disk->files($path);
                foreach ($files as $file) {
                    try {
                        $items[] = [
                            'type' => 'file',
                            'path' => $file,
                            'name' => basename($file),
                            'size' => $disk->size($file),
                            'lastModified' => $disk->lastModified($file),
                        ];
                    } catch (\Exception $e) {
                        // Skip if we can't get metadata for this file
                        $items[] = [
                            'type' => 'file',
                            'path' => $file,
                            'name' => basename($file),
                            'size' => null,
                            'lastModified' => null,
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::warning('SFTP files listing failed', [
                    'path' => $path,
                    'error' => $e->getMessage(),
                ]);
            }

            return $items;
        } catch (\Exception $e) {
            Log::error('SFTP list directory failed', [
                'path' => $path,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Provide more specific error messages
            $errorMessage = $e->getMessage();
            if (str_contains($errorMessage, 'Connection timed out') || str_contains($errorMessage, 'timeout')) {
                throw new \RuntimeException(
                    'SFTP sunucusuna bağlanılamadı. Bağlantı zaman aşımına uğradı. '.
                    'Lütfen sunucunun erişilebilir olduğundan ve IP adresinizin whitelist\'te olduğundan emin olun.'
                );
            } elseif (str_contains($errorMessage, 'Connection refused')) {
                throw new \RuntimeException(
                    'SFTP sunucusu bağlantıyı reddetti. Port 22\'nin açık olduğundan emin olun.'
                );
            } elseif (str_contains($errorMessage, 'Authentication failed')) {
                throw new \RuntimeException(
                    'SFTP kimlik doğrulama başarısız. Kullanıcı adı ve şifrenizi kontrol edin.'
                );
            }

            throw $e;
        }
    }

    /**
     * Read file content
     */
    public function readFile(string $path): ?string
    {
        try {
            $this->checkConfiguration();

            if (!Storage::disk('sftp')->exists($path)) {
                return null;
            }

            return Storage::disk('sftp')->get($path);
        } catch (\Exception $e) {
            Log::error('SFTP read file failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Check if file exists
     */
    public function fileExists(string $path): bool
    {
        try {
            $this->checkConfiguration();
            return Storage::disk('sftp')->exists($path);
        } catch (\Exception $e) {
            Log::error('SFTP file exists check failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
