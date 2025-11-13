import { useMemo } from 'react';
import { FilterState, WebhookData } from '../types';

export function useWebhookFilters(
    webhooks: WebhookData[],
    filters: FilterState,
) {
    const filteredWebhooks = useMemo(() => {
        return webhooks.filter((webhook) => {
            // Header filter
            if (filters.headerKey || filters.headerValue) {
                const headerKeyLower = filters.headerKey.toLowerCase();
                const headerValueLower = filters.headerValue.toLowerCase();
                const headerMatches = Object.entries(webhook.headers).some(
                    ([key, values]) => {
                        const keyMatch =
                            !filters.headerKey ||
                            key.toLowerCase().includes(headerKeyLower);
                        const valueMatch =
                            !filters.headerValue ||
                            values.some((val) =>
                                val.toLowerCase().includes(headerValueLower),
                            );
                        return keyMatch && valueMatch;
                    },
                );
                if (!headerMatches) return false;
            }

            // Body filters
            const body = webhook.body || {};

            if (
                filters.status &&
                !String(body.status || '').includes(filters.status)
            )
                return false;
            if (
                filters.paymentId &&
                !String(body.paymentId || '').includes(filters.paymentId)
            )
                return false;
            if (
                filters.paymentConversationId &&
                !String(body.paymentConversationId || '').includes(
                    filters.paymentConversationId,
                )
            )
                return false;
            if (
                filters.merchantId &&
                !String(body.merchantId || '').includes(filters.merchantId)
            )
                return false;
            if (
                filters.token &&
                !String(body.token || '').includes(filters.token)
            )
                return false;
            if (
                filters.iyziPaymentId &&
                !String(body.iyziPaymentId || '').includes(
                    filters.iyziPaymentId,
                )
            )
                return false;
            if (
                filters.iyziReferenceCode &&
                !String(body.iyziReferenceCode || '').includes(
                    filters.iyziReferenceCode,
                )
            )
                return false;
            if (
                filters.iyziEventType &&
                !String(body.iyziEventType || '').includes(
                    filters.iyziEventType,
                )
            )
                return false;

            // Subscription filters
            if (
                filters.orderReferenceCode &&
                !String(body.orderReferenceCode || '').includes(
                    filters.orderReferenceCode,
                )
            )
                return false;
            if (
                filters.customerReferenceCode &&
                !String(body.customerReferenceCode || '').includes(
                    filters.customerReferenceCode,
                )
            )
                return false;
            if (
                filters.subscriptionReferenceCode &&
                !String(body.subscriptionReferenceCode || '').includes(
                    filters.subscriptionReferenceCode,
                )
            )
                return false;

            return true;
        });
    }, [webhooks, filters]);

    return filteredWebhooks;
}
