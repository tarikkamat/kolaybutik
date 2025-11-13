import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterState } from '../types';

interface WebhookFilterDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onClearFilters: () => void;
}

export function WebhookFilterDialog({
    isOpen,
    onOpenChange,
    filters,
    onFilterChange,
    onClearFilters,
}: WebhookFilterDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Webhook Filtrele</DialogTitle>
                    <DialogDescription>
                        Webhook'ları header ve body parametrelerine göre
                        filtreleyin.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Header Filters */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Header Filtreleri
                        </h3>
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="header-key">Header Key</Label>
                                <Input
                                    id="header-key"
                                    placeholder="örn: X-IYZ-SIGNATURE-V3"
                                    value={filters.headerKey}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'headerKey',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="header-value">
                                    Header Value
                                </Label>
                                <Input
                                    id="header-value"
                                    placeholder="Header değeri"
                                    value={filters.headerValue}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'headerValue',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Body Filters - Direct Format */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Body Filtreleri (Direct Format)
                        </h3>
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    placeholder="örn: SUCCESS, FAILURE"
                                    value={filters.status}
                                    onChange={(e) =>
                                        onFilterChange('status', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="payment-id">Payment ID</Label>
                                <Input
                                    id="payment-id"
                                    placeholder="Payment ID"
                                    value={filters.paymentId}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'paymentId',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="payment-conversation-id">
                                    Payment Conversation ID
                                </Label>
                                <Input
                                    id="payment-conversation-id"
                                    placeholder="Payment Conversation ID"
                                    value={filters.paymentConversationId}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'paymentConversationId',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="merchant-id">Merchant ID</Label>
                                <Input
                                    id="merchant-id"
                                    placeholder="Merchant ID"
                                    value={filters.merchantId}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'merchantId',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="token">Token (HPP)</Label>
                                <Input
                                    id="token"
                                    placeholder="Token"
                                    value={filters.token}
                                    onChange={(e) =>
                                        onFilterChange('token', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="iyzi-payment-id">
                                    iyziPaymentId
                                </Label>
                                <Input
                                    id="iyzi-payment-id"
                                    placeholder="iyziPaymentId"
                                    value={filters.iyziPaymentId}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'iyziPaymentId',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="iyzi-reference-code">
                                    iyziReferenceCode
                                </Label>
                                <Input
                                    id="iyzi-reference-code"
                                    placeholder="iyziReferenceCode"
                                    value={filters.iyziReferenceCode}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'iyziReferenceCode',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="iyzi-event-type">
                                    iyziEventType
                                </Label>
                                <Input
                                    id="iyzi-event-type"
                                    placeholder="örn: PAYMENT_API, CHECKOUT_FORM_AUTH"
                                    value={filters.iyziEventType}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'iyziEventType',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subscription Filters */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Abonelik Filtreleri
                        </h3>
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="order-reference-code">
                                    Order Reference Code
                                </Label>
                                <Input
                                    id="order-reference-code"
                                    placeholder="Order Reference Code"
                                    value={filters.orderReferenceCode}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'orderReferenceCode',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="customer-reference-code">
                                    Customer Reference Code
                                </Label>
                                <Input
                                    id="customer-reference-code"
                                    placeholder="Customer Reference Code"
                                    value={filters.customerReferenceCode}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'customerReferenceCode',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="subscription-reference-code">
                                    Subscription Reference Code
                                </Label>
                                <Input
                                    id="subscription-reference-code"
                                    placeholder="Subscription Reference Code"
                                    value={filters.subscriptionReferenceCode}
                                    onChange={(e) =>
                                        onFilterChange(
                                            'subscriptionReferenceCode',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClearFilters}>
                            Temizle
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button">Uygula</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
