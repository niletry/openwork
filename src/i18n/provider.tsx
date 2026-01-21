import { createSignal, createContext, useContext, Accessor, Show } from "solid-js";
import { dictionaries, type Locale } from "./locales";
import { LOCALE_PREF_KEY } from "../app/constants";

export { dictionaries, type Locale };

export const LANGUAGE_OPTIONS: { label: string; value: Locale; nativeName: string }[] = [
    { label: "English", value: "en", nativeName: "English" },
    { label: "Chinese", value: "zh", nativeName: "中文" },
];

const I18nContext = createContext<[
    (key: string, ...args: any[]) => string,
    { locale: any; setLocale: (l: Locale) => void }
]>();

function getStoredLocale(): Locale {
    if (typeof window === "undefined") return "en";
    try {
        const stored = window.localStorage.getItem(LOCALE_PREF_KEY);
        if (stored && stored in dictionaries) {
            return stored as Locale;
        }
    } catch {
        // ignore
    }
    return "en";
}

// Simple dot notation resolver
function resolve(obj: any, path: string): string | undefined {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], obj) as string;
}

export function I18nProvider(props: { children: any }) {
    const [locale, _setLocale] = createSignal<Locale>(getStoredLocale());

    const setLocale = (l: Locale) => {
        _setLocale(l);
        try {
            window.localStorage.setItem(LOCALE_PREF_KEY, l);
        } catch {
            // ignore
        }
    };

    const t = (key: string, ...args: any[]): string => {
        const currentDict = dictionaries[locale()];
        const value = resolve(currentDict, key);
        let result: string;

        if (value === undefined) {
            // Fallback to English if not found
            if (locale() !== "en") {
                const enVal = resolve(dictionaries.en, key);
                if (enVal !== undefined) {
                    result = enVal as string;
                } else {
                    return key;
                }
            } else {
                return key;
            }
        } else {
            result = value as string;
        }

        // Handle parameter substitution
        if (args.length > 0 && typeof args[0] === 'object') {
            const params = args[0] as Record<string, string>;
            Object.entries(params).forEach(([placeholder, replacement]) => {
                result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacement);
            });
        }

        return result;
    };

    // Proxy for compatibility with existing usage in App.tsx: locale(l => ...)
    const localeProxy: any = (arg?: any) => {
        if (arg === undefined) return locale();
        if (typeof arg === 'function') {
            setLocale(arg(locale()));
        } else {
            setLocale(arg);
        }
    };

    return (
        <I18nContext.Provider value={[t, { locale: localeProxy, setLocale }]} >
            {props.children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) throw new Error("useI18n must be used within I18nProvider");
    return context;
}
// Force HMR refresh by touching this file
