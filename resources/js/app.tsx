import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Global error handler - Browser extension hatalarını filtrele
if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        // Browser extension hatalarını filtrele
        const errorMessage = args[0]?.toString() || '';
        if (
            errorMessage.includes('content_script.js') ||
            errorMessage.includes('Cannot read properties of undefined') ||
            errorMessage.includes("reading 'control'") ||
            errorMessage.includes('shouldOfferCompletionListForField')
        ) {
            // Bu hataları sessizce yok say
            return;
        }
        // Diğer hataları normal şekilde göster
        originalError.apply(console, args);
    };

    // Uncaught exception handler
    window.addEventListener(
        'error',
        (event) => {
            const errorMessage = event.message || '';
            if (
                errorMessage.includes('content_script.js') ||
                errorMessage.includes('Cannot read properties of undefined') ||
                errorMessage.includes("reading 'control'") ||
                errorMessage.includes('shouldOfferCompletionListForField')
            ) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        },
        true,
    );

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        const errorMessage = event.reason?.toString() || '';
        if (
            errorMessage.includes('content_script.js') ||
            errorMessage.includes('Cannot read properties of undefined') ||
            errorMessage.includes("reading 'control'") ||
            errorMessage.includes('shouldOfferCompletionListForField')
        ) {
            event.preventDefault();
            return false;
        }
    });
}
