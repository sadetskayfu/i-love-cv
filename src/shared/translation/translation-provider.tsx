import * as React from 'react';
import { TranslationContext, translations, type Language } from './translation-context';

export function TranslationProvider({
	children,
	defaultLanguage = 'en',
}: {
	children: React.ReactNode;
	defaultLanguage?: Language;
}) {
	const [language, setLanguage] = React.useState<Language>(defaultLanguage);

	const t = React.useCallback(
		(key: string) => {
			const dict = translations[language];

			if (!dict) {
				return key;
			}

			return dict[key] ?? key;
		},
		[language]
	);

	const contextValue: TranslationContext = React.useMemo(
		() => ({ language, setLanguage, t }),
		[language, setLanguage, t]
	);

	return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>;
}
