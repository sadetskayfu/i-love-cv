import { MAX_TEMPLATE_NAME_LENGTH } from './max-template-name-length';

export function validateTemplateName(name: string, isSubmit: boolean = false) {
	if (isSubmit) {
		if (name.length === 0 || name.length > MAX_TEMPLATE_NAME_LENGTH) {
			return false;
		}

		// Удаляем пробелы в конце
		return name.trim();
	} else {
		if (/[^\p{L}\p{N} ]/u.test(name)) {
			return false;
		}

		// Запрет пробела в начале
		if (name.startsWith(' ')) {
			return false;
		}

		// Запрет двух пробелов подряд
		if (name.includes('  ')) {
			return false;
		}

		if (name.length > MAX_TEMPLATE_NAME_LENGTH) {
			return false;
		}

		return true;
	}
}
