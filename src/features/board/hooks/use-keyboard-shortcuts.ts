import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardState } from '../model';

export function useKeyboardShortcuts() {
	const [isNodeDragging] = useAtom(boardState.isNodesDraggingAtom);
	const toggleMode = useSetAtom(boardActions.toggleMode);

	const undo = useSetAtom(boardActions.undo);
	const redo = useSetAtom(boardActions.redo);

	function handleKeyboardShortcuts(event: React.KeyboardEvent) {
		if (isNodeDragging) {
			return;
		}

		if (event.key === 'Escape') {
			toggleMode('selection', false);
		}

		if (event.code === 'KeyS') {
			toggleMode('selection');
		}

		if (event.code === 'KeyF') {
			toggleMode('add-shape-node');
		}

		if (event.code === 'KeyT') {
			toggleMode('add-text-node');
		}

		if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.code === 'KeyZ') {
			undo();
		}

		if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyZ') {
			redo();
		}

		if ((event.ctrlKey || event.metaKey) && event.code === 'KeyC') {
		}

		if ((event.ctrlKey || event.metaKey) && event.code === 'KeyV') {
		}

		if (event.key === 'Delete') {
		}
	}

	return { handleKeyboardShortcuts };
}
