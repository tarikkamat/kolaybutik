export interface OrderSuccessProps {
    orderNumber?: string;
    orderId?: string | number;
    paymentId?: string;
    paymentMethod?: string;
    paymentData?: any;
}

export interface OrderFailedProps {
    error?: string;
    orderId?: number;
}

export interface OrderShowProps {
    orderId: string;
    paymentId?: string;
    paymentMethod?: string;
    paymentData?: any;
}
