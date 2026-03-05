import { useI18n } from '@/i18n';
import StoreLayout from '@/layouts/store-layout';
import { OrderSuccessProps } from '@/types/order';
import { Head } from '@inertiajs/react';
import { OrderSuccessContent } from './components/order-success-content';

export default function OrderSuccess(props: OrderSuccessProps) {
    const { text } = useI18n();

    return (
        <StoreLayout title={text('Sipariş Başarılı', 'Order Successful')}>
            <Head title={text('Sipariş Başarılı', 'Order Successful')} />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <OrderSuccessContent {...props} />
            </div>
        </StoreLayout>
    );
}
