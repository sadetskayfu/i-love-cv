import { createRoot } from 'react-dom/client';
import { TranslationProvider } from '@/shared/translation';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
	<TranslationProvider defaultLanguage="en">
		<App />
	</TranslationProvider>
);
