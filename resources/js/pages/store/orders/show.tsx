import StoreLayout from '@/layouts/store-layout';
import { OrderShowProps } from '@/types/order';
import { Head } from '@inertiajs/react';
import { OrderDetailsContent } from './components/order-details-content';

export default function OrderShow(props: OrderShowProps) {
    return (
        <StoreLayout title="Sipariş Detayları">
            <Head title="Sipariş Detayları" />
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <OrderDetailsContent {...props} />
            </div>
        </StoreLayout>
    );
}
