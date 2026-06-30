import { useContext } from '../hooks/use-context';
import { TranslationContext } from './translation-context';

export function useTranslation() {
	return useContext(
		TranslationContext,
		'TranslationContext is missing, useTranslation must be used within TranslationProvider'
	);
}
