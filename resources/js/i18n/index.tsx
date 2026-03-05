import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { type Language, translations } from './translations';

const STORAGE_KEY = 'kolayapp.language';

interface I18nContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
    text: (trText: string, enText: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function isLanguage(value: string | null): value is Language {
    return value === 'tr' || value === 'en';
}

function getInitialLanguage(): Language {
    if (typeof window === 'undefined') {
        return 'tr';
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(savedLanguage)) {
        return savedLanguage;
    }

    return window.navigator.language.toLowerCase().startsWith('en')
        ? 'en'
        : 'tr';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = useCallback((nextLanguage: Language) => {
        setLanguageState(nextLanguage);
    }, []);

    const t = useCallback(
        (key: string) =>
            translations[language][key] ?? translations.tr[key] ?? key,
        [language],
    );

    const text = useCallback(
        (trText: string, enText: string) =>
            language === 'tr' ? trText : enText,
        [language],
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
            text,
        }),
        [language, setLanguage, t, text],
    );

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used inside I18nProvider.');
    }

    return context;
}

export type { Language };
