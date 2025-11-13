import { CartItemsListProps } from '@/types/cart';
import { CartItem } from './cart-item';

export function CartItemsList({
    items,
    updatingItems,
    removingItems,
    onUpdateQuantity,
    onRemoveItem,
}: CartItemsListProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    isUpdating={updatingItems.has(item.id)}
                    isRemoving={removingItems.has(item.id)}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    );
}
