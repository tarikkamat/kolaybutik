import { useI18n, type Language } from '@/i18n';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { language, setLanguage, t } = useI18n();

    return (
        <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`🇹🇷 ${t('common.turkish')}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="tr">🇹🇷 {t('common.turkish')}</SelectItem>
                <SelectItem value="en">🇺🇸 {t('common.english')}</SelectItem>
            </SelectContent>
        </Select>
    );
}
