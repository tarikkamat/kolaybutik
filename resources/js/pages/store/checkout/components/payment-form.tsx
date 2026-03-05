import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { useI18n } from '@/i18n';
import { PaymentFormProps } from '@/types/cart';
import { Calendar, CreditCard, Lock, User } from 'lucide-react';

export function PaymentForm({
    formData,
    onInputChange,
    onCardNumberChange,
    onCardExpiryChange,
    onCardCvvChange,
}: PaymentFormProps) {
    const { text } = useI18n();

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Kart Numarası *', 'Card Number *')}
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <CreditCard className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="card_number"
                            required
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={formData.card_number}
                            onChange={(e) => onCardNumberChange(e.target.value)}
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Kart Üzerindeki İsim *', 'Name on Card *')}
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="card_name"
                            required
                            value={formData.card_name}
                            onChange={onInputChange}
                            placeholder={text(
                                'Kart Üzerindeki İsim',
                                'Name on Card',
                            )}
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {text('Son Kullanma *', 'Expiry Date *')}
                        </label>
                        <InputGroup>
                            <InputGroupAddon>
                                <Calendar className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                                type="text"
                                name="card_expiry"
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                                value={formData.card_expiry}
                                onChange={(e) =>
                                    onCardExpiryChange(e.target.value)
                                }
                                hasAddon
                            />
                        </InputGroup>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            CVV *
                        </label>
                        <InputGroup>
                            <InputGroupAddon>
                                <Lock className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                                type="text"
                                name="card_cvv"
                                required
                                placeholder="123"
                                maxLength={3}
                                value={formData.card_cvv}
                                onChange={(e) =>
                                    onCardCvvChange(e.target.value)
                                }
                                hasAddon
                            />
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
