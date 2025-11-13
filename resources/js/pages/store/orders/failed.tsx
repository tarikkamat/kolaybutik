import StoreLayout from '@/layouts/store-layout';
import { OrderFailedProps } from '@/types/order';
import { Head } from '@inertiajs/react';
import { OrderFailedContent } from './components/order-failed-content';

export default function OrderFailed(props: OrderFailedProps) {
    return (
        <StoreLayout title="Sipariş Başarısız">
            <Head title="Sipariş Başarısız" />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <OrderFailedContent {...props} />
            </div>
        </StoreLayout>
    );
}
