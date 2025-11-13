import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { PaymentFormProps } from '@/types/cart';
import { Calendar, CreditCard, Lock, User } from 'lucide-react';

export function PaymentForm({
    formData,
    onInputChange,
    onCardNumberChange,
    onCardExpiryChange,
    onCardCvvChange,
}: PaymentFormProps) {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Kart Numarası *
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
                        Kart Üzerindeki İsim *
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
                            placeholder="Kart Üzerindeki İsim"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Son Kullanma *
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
