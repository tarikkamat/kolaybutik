export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'error';
}

export interface ConversationState {
    conversationId: string | null;
    requestId: string | null;
    messages: ChatMessage[];
    isPolling: boolean;
    error: string | null;
}

export interface CreateConversationResponse {
    status: 'success' | 'error';
    success: boolean;
    data?: {
        conversation_id: string;
        request_id: string;
    };
    errorMessage?: string;
    errorCode?: string;
    message?: string;
}

export interface GetAnswerResponse {
    status: 'success' | 'error';
    success: boolean;
    data?: {
        status: 'in_progress' | 'finished' | 'error';
        answer?: string;
        conversation_id: string;
        request_id: string;
    };
    errorMessage?: string;
    errorCode?: string;
    message?: string;
}

export interface ConversationHistoryResponse {
    status: 'success' | 'error';
    success: boolean;
    data?: {
        conversation: any[];
        conversation_id: string;
    };
    errorMessage?: string;
    errorCode?: string;
    message?: string;
}
