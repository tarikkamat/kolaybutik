import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { SavedCard } from '@/types/cart';
import { CreditCard, List, Loader2 } from 'lucide-react';

interface SavedCardPaymentProps {
    formData: {
        card_user_key?: string;
        card_token?: string;
        card_cvv?: string;
    };
    savedCards: SavedCard[];
    isLoadingSavedCards?: boolean;
    savedCardsError?: string | null;
    onFetchSavedCards?: () => void;
    onSavedCardSelect?: (cardToken: string) => void;
    onCardUserKeyChange?: (value: string) => void;
    onCardCvvChange?: (value: string) => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
}

export function SavedCardPayment({
    formData,
    savedCards,
    isLoadingSavedCards = false,
    savedCardsError,
    onFetchSavedCards,
    onSavedCardSelect,
    onCardUserKeyChange,
    onCardCvvChange,
    onSubmit,
    isSubmitting = false,
    isValid = false,
}: SavedCardPaymentProps) {
    const { text } = useI18n();

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Card User Key', 'Card User Key')}
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                            value={formData.card_user_key || ''}
                            onChange={(e) =>
                                onCardUserKeyChange?.(e.target.value)
                            }
                            placeholder={text(
                                'cardUserKey girin',
                                'Enter cardUserKey',
                            )}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onFetchSavedCards}
                            disabled={
                                isLoadingSavedCards ||
                                !formData.card_user_key?.trim()
                            }
                        >
                            {isLoadingSavedCards ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <List className="mr-2 h-4 w-4" />
                            )}
                            {text('Kartları Listele', 'List Cards')}
                        </Button>
                    </div>
                </div>

                {isLoadingSavedCards && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {text(
                            'Saklı kartlar yükleniyor...',
                            'Loading saved cards...',
                        )}
                    </p>
                )}

                {!isLoadingSavedCards && savedCardsError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {savedCardsError}
                    </p>
                )}

                {!isLoadingSavedCards &&
                    !savedCardsError &&
                    savedCards.length === 0 && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {text(
                                'Bu cardUserKey için kart bulunamadı.',
                                'No cards found for this cardUserKey.',
                            )}
                        </p>
                    )}

                {!isLoadingSavedCards && savedCards.length > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {text('Saklı Kartlar', 'Saved Cards')}
                        </label>
                        <div className="space-y-2">
                            {savedCards.map((card) => (
                                <label
                                    key={card.cardToken}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                                        formData.card_token === card.cardToken
                                            ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="saved_card_token"
                                        value={card.cardToken}
                                        checked={
                                            formData.card_token ===
                                            card.cardToken
                                        }
                                        onChange={() =>
                                            onSavedCardSelect?.(card.cardToken)
                                        }
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {card.cardAlias ||
                                                text('Kartım', 'My Card')}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {card.cardBankName || '-'}{' '}
                                            {card.cardAssociation || ''} ••••{' '}
                                            {card.lastFourDigits || '----'}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('CVV (Opsiyonel)', 'CVV (Optional)')}
                    </label>
                    <Input
                        type="text"
                        value={formData.card_cvv || ''}
                        onChange={(e) => onCardCvvChange?.(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full sm:w-40"
                    />
                </div>
            </div>

            <div className="mt-6">
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting || !isValid}
                    className="w-full"
                >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isSubmitting
                        ? text('İşleniyor...', 'Processing...')
                        : text('Saklı Kart ile Öde', 'Pay with Saved Card')}
                </Button>
            </div>
        </div>
    );
}
