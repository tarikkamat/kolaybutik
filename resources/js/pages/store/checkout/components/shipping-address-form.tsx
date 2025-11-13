import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { ShippingAddressFormProps } from '@/types/cart';
import { Globe, Hash, Mail, MapPin, Phone, User, Wand2 } from 'lucide-react';

export function ShippingAddressForm({
    formData,
    onInputChange,
    onAutoFill,
}: ShippingAddressFormProps) {
    return (
        <div>
            {onAutoFill && (
                <div className="mb-4 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAutoFill}
                        className="gap-2"
                    >
                        <Wand2 className="h-4 w-4" />
                        Otomatik Doldur
                    </Button>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ad Soyad *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={onInputChange}
                            placeholder="Ad Soyad"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        E-posta *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <Mail className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={onInputChange}
                            placeholder="ornek@email.com"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Telefon *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <Phone className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={onInputChange}
                            placeholder="0555 123 45 67"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Adres *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <MapPin className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={onInputChange}
                            placeholder="Adres"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Şehir *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <MapPin className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={onInputChange}
                            placeholder="Şehir"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Posta Kodu *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <Hash className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            name="postal_code"
                            required
                            value={formData.postal_code}
                            onChange={onInputChange}
                            placeholder="34000"
                            hasAddon
                        />
                    </InputGroup>
                </div>
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ülke *
                    </label>
                    <InputGroup>
                        <InputGroupAddon>
                            <Globe className="h-4 w-4" />
                        </InputGroupAddon>
                        <select
                            name="country"
                            required
                            value={formData.country}
                            onChange={onInputChange}
                            className="flex h-9 w-full min-w-0 rounded-l-none rounded-r-md border border-l-0 border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                            <option value="Türkiye">Türkiye</option>
                        </select>
                    </InputGroup>
                </div>
            </div>
        </div>
    );
}
