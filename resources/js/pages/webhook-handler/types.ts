export interface WebhookData {
    timestamp: string;
    method: string;
    headers: Record<string, string[]>;
    body: Record<string, any>;
    ip: string;
    user_agent: string;
}

export interface FilterState {
    // Header filters
    headerKey: string;
    headerValue: string;
    // Body filters
    status: string;
    paymentId: string;
    paymentConversationId: string;
    merchantId: string;
    token: string;
    iyziPaymentId: string;
    iyziReferenceCode: string;
    iyziEventType: string;
    // Subscription filters
    orderReferenceCode: string;
    customerReferenceCode: string;
    subscriptionReferenceCode: string;
}

export interface WebhookSettings {
    hiddenFields: string[];
    eventTypeFilter: string[]; // Multiple selection
    statusFilter: string[]; // Multiple selection
}

// Event types for Direct Format
export const DIRECT_EVENT_TYPES = [
    'PAYMENT_API',
    'API_AUTH',
    'THREE_DS_AUTH',
    'THREE_DS_CALLBACK',
    'BKM_AUTH',
    'BALANCE',
    'CONTACTLESS_AUTH',
    'CONTACTLESS_REFUND',
] as const;

// Event types for HPP Format
export const HPP_EVENT_TYPES = [
    'CHECKOUT_FORM_AUTH',
    'BANK_TRANSFER_AUTH',
    'BKM_AUTH',
    'BALANCE',
    'CONTACTLESS_AUTH',
    'CONTACTLESS_REFUND',
    'CREDIT_PAYMENT_AUTH',
    'CREDIT_PAYMENT_PENDING',
    'CREDIT_PAYMENT_INIT',
    'PWI_TKN_FUND',
    'PWI_TKN_AUTH',
    'PWI_TKN_THREEDS_AUTH',
] as const;

// All event types (for backward compatibility)
export const EVENT_TYPES = [...DIRECT_EVENT_TYPES, ...HPP_EVENT_TYPES] as const;

// Status values for Direct Format
export const DIRECT_STATUS_VALUES = [
    'FAILURE',
    'SUCCESS',
    'INIT_THREEDS',
    'CALLBACK_THREEDS',
    'BKM_POS_SELECTED',
    'INIT_APM',
    'INIT_CONTACTLESS',
] as const;

// Status values for HPP Format
export const HPP_STATUS_VALUES = [
    'FAILURE',
    'SUCCESS',
    'INIT_THREEDS',
    'CALLBACK_THREEDS',
    'BKM_POS_SELECTED',
    'INIT_APM',
    'INIT_BANK_TRANSFER',
    'INIT_CREDIT',
    'PENDING_CREDIT',
    'INIT_CONTACTLESS',
] as const;

// All status values (union of both)
export const ALL_STATUS_VALUES = [
    ...new Set([...DIRECT_STATUS_VALUES, ...HPP_STATUS_VALUES]),
] as const;

export const BODY_FIELDS = [
    'paymentId',
    'paymentConversationId',
    'merchantId',
    'token',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
    'orderReferenceCode',
    'customerReferenceCode',
    'subscriptionReferenceCode',
] as const;

// Direkt Format alanları
export const DIRECT_FORMAT_FIELDS = [
    'paymentConversationId',
    'merchantId',
    'paymentId',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
] as const;

// HPP Format alanları
export const HPP_FORMAT_FIELDS = [
    'paymentConversationId',
    'merchantId',
    'token',
    'status',
    'iyziReferenceCode',
    'iyziEventType',
    'iyziEventTime',
    'iyziPaymentId',
] as const;
