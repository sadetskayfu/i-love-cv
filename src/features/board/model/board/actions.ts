import { atom } from 'jotai';
import { nodeSelectionStore } from '../node-selection';
import { modeAtom } from './state';
import type { Mode } from '../types';

export const toggleMode = atom(
	null,
	(get, set, mode: Mode, toggled: boolean = true, clearSelection: boolean = true) => {
		const currentMode = get(modeAtom);

		if (toggled && currentMode === mode) {
			set(modeAtom, 'idle');

			if (clearSelection) {
				set(nodeSelectionStore.clearSelectedNodes);
			}
		} else {
			set(modeAtom, mode);

			if (clearSelection) {
				set(nodeSelectionStore.clearSelectedNodes);
			}
		}
	}
);
