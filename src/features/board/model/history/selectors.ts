import { atom } from 'jotai';
import { historyAtom, historyIndexAtom } from './state';

export const hasRedo = atom(get => {
	const historyIndex = get(historyIndexAtom);
	const history = get(historyAtom);

	if (historyIndex >= history.length - 1) {
		return false;
	}

	return true;
});

export const hasUndo = atom(get => {
	const historyIndex = get(historyIndexAtom);

	if (historyIndex <= 0) {
		return false;
	}

	return true;
});
