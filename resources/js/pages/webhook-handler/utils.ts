export const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatJson = (obj: any): string => {
    try {
        if (typeof obj === 'string') {
            return obj;
        }
        return JSON.stringify(obj, null, 2);
    } catch {
        return String(obj);
    }
};

export const getWebhookUrl = (): string => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api/webhook`;
    }
    return '/api/webhook';
};
