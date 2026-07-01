import { atom } from 'jotai';
import { nodeManagerStore } from '../node-manager';
import { nodeSelectionStore } from '../node-selection';
import { hasRedo, hasUndo } from './selectors';
import { historyAtom, historyIndexAtom } from './state';

export const clearHistory = atom(null, (_, set) => {
	set(historyAtom, []);
	set(historyIndexAtom, 0);
});

export const undo = atom(null, (get, set) => {
	const history = get(historyAtom);
	const historyIndex = get(historyIndexAtom);

	if (!get(hasUndo)) {
		return;
	}

	set(historyIndexAtom, historyIndex - 1);
	set(nodeManagerStore.updateNodes, history[historyIndex - 1], false);
	set(nodeSelectionStore.clearSelectedNodes);
});

export const redo = atom(null, (get, set) => {
	const history = get(historyAtom);
	const historyIndex = get(historyIndexAtom);

	if (!get(hasRedo)) {
		return;
	}

	set(historyIndexAtom, historyIndex + 1);
	set(nodeManagerStore.updateNodes, history[historyIndex + 1], false);
	set(nodeSelectionStore.clearSelectedNodes);
});
