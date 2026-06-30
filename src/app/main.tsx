import { createRoot } from 'react-dom/client';
import { App } from './app';
import { TranslationProvider } from '@/shared/translation';

createRoot(document.getElementById('root')!).render(
	<TranslationProvider defaultLanguage='en'>
		<App />
	</TranslationProvider>
);
