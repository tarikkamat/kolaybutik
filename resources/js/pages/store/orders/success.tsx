import StoreLayout from '@/layouts/store-layout';
import { OrderSuccessProps } from '@/types/order';
import { Head } from '@inertiajs/react';
import { OrderSuccessContent } from './components/order-success-content';

export default function OrderSuccess(props: OrderSuccessProps) {
    return (
        <StoreLayout title="Sipariş Başarılı">
            <Head title="Sipariş Başarılı" />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <OrderSuccessContent {...props} />
            </div>
        </StoreLayout>
    );
}
