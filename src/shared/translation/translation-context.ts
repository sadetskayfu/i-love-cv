import * as React from 'react';
import ru from './locales/ru.json';
import en from './locales/en.json';

export type Language = 'ru' | 'en';

export type TranslationContext = {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: string) => string;
};

export const translations: Record<Language, Record<string, string>> = { ru, en };

export const TranslationContext = React.createContext<TranslationContext | undefined>(undefined);
