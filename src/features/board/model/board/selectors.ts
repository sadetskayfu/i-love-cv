import { atom } from 'jotai';
import { modeAtom } from './state';

export const isSelectionMode = atom(get => {
	const mode = get(modeAtom);
	return mode === 'selection';
});
