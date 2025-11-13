/**
 * Get CSRF token from meta tag or cookie
 */
export function getCsrfToken(): string {
    // Try to get from meta tag
    const metaToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (metaToken) {
        return metaToken;
    }

    // Try to get from cookie (Laravel stores it as XSRF-TOKEN)
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }

    return '';
}
