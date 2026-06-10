import type z from 'zod';

export function loadFromLocalStorage<T>(
	key: string,
	{ clearOnError, zodSchema }: { clearOnError?: boolean; zodSchema?: z.ZodType<T> }
): T | null {
	const stored = localStorage.getItem(key);

	if (!stored) {
		return null;
	}

	try {
		const parsed = JSON.parse(stored);

		if (!zodSchema) {
			return parsed;
		}

		console.log(parsed);

		const result = zodSchema.safeParse(parsed);

		if (result.success) {
			return result.data;
		} else {
			console.error(`Invalid data from local storage. Key: ${key}. Error: ${result.error}`);

			if (clearOnError) {
				localStorage.removeItem(key);
			}

			return null;
		}
	} catch {
		console.error('Failed to parse JSON');

		if (clearOnError) {
			localStorage.removeItem(key);
		}

		return null;
	}
}
