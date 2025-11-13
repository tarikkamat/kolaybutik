<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Service\SftpService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SftpController extends Controller
{
    private SftpService $sftpService;

    public function __construct(SftpService $sftpService)
    {
        $this->sftpService = $sftpService;
    }

    /**
     * Display SFTP page
     */
    public function index(): Response
    {
        return Inertia::render('sftp/index');
    }

    /**
     * List directory contents
     */
    public function listDirectory(Request $request)
    {
        try {
            $validated = $request->validate([
                'path' => 'nullable|string',
            ]);

            $path = $validated['path'] ?? '/';
            $contents = $this->sftpService->listDirectory($path);

            return back()->with([
                'sftpContents' => $contents,
                'sftpPath' => $path,
                'sftpError' => null,
            ]);
        } catch (Exception $e) {
            return back()->with([
                'sftpError' => 'Dizin listelenemedi: '.$e->getMessage(),
                'sftpContents' => null,
            ]);
        }
    }

    /**
     * Download file
     */
    public function downloadFile(Request $request)
    {
        try {
            $validated = $request->validate([
                'remotePath' => 'required|string',
            ]);

            $content = $this->sftpService->readFile($validated['remotePath']);

            if ($content === null) {
                return back()->withErrors([
                    'download' => 'Dosya okunamadı veya bulunamadı',
                ]);
            }

            // Return download response (binary file download)
            $filename = basename($validated['remotePath']);
            return response($content)
                ->header('Content-Type', 'application/octet-stream')
                ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
        } catch (Exception $e) {
            return back()->withErrors([
                'download' => 'Dosya indirilemedi: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Read file content
     */
    public function readFile(Request $request)
    {
        try {
            $validated = $request->validate([
                'path' => 'required|string',
            ]);

            $content = $this->sftpService->readFile($validated['path']);

            if ($content === null) {
                return back()->with([
                    'sftpFileError' => 'Dosya okunamadı veya bulunamadı',
                    'sftpFileContent' => null,
                ]);
            }

            return back()->with([
                'sftpFileContent' => $content,
                'sftpFilePath' => $validated['path'],
                'sftpFileError' => null,
            ]);
        } catch (Exception $e) {
            return back()->with([
                'sftpFileError' => 'Dosya okunamadı: '.$e->getMessage(),
                'sftpFileContent' => null,
            ]);
        }
    }
}
