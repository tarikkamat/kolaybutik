export interface CartItem {
    id: number;
    product_id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        sale_price?: number;
        image?: string;
    };
    quantity: number;
    price: number;
}

export interface CartIndexProps {
    items: CartItem[];
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
}

export interface CheckoutCartItem {
    id: number;
    product: {
        name: string;
        image?: string;
    };
    quantity: number;
    price: number;
}

export interface CheckoutIndexProps {
    items: CheckoutCartItem[];
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
}

export interface CartItemProps {
    item: CartItem;
    isUpdating: boolean;
    isRemoving: boolean;
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export interface CartItemsListProps {
    items: CartItem[];
    updatingItems: Set<number>;
    removingItems: Set<number>;
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export interface CartSummaryProps {
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
}

export interface ShippingAddressFormProps {
    formData: {
        full_name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postal_code: string;
        country: string;
    };
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onAutoFill?: () => void;
}

export interface PaymentFormProps {
    formData: {
        card_number: string;
        card_name: string;
        card_expiry: string;
        card_cvv: string;
    };
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onCardNumberChange: (value: string) => void;
    onCardExpiryChange: (value: string) => void;
    onCardCvvChange: (value: string) => void;
}

export interface CheckoutSummaryProps {
    items: CheckoutCartItem[];
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
}

export type PaymentMethod =
    | 'credit_card'
    | 'checkout_form'
    | 'iyzico'
    | 'iyzico_quick'
    | 'saved_card';

export interface PaymentOptionsProps {
    formData: {
        // Shipping Address
        full_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country?: string;
        // Payment
        card_number: string;
        card_name: string;
        card_expiry: string;
        card_cvv: string;
        payment_method?: string;
        use_3d?: boolean;
        installment?: number;
    };
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onCardNumberChange: (value: string) => void;
    onCardExpiryChange: (value: string) => void;
    onCardCvvChange: (value: string) => void;
    onPaymentMethodChange?: (method: string) => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
}
