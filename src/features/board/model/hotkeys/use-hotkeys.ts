import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { hotkey } from '@/shared/helpers';
import { boardStore } from '../board';
import { historyStore } from '../history';
import { nodeDraggingStore } from '../node-dragging';
import { nodeManagerStore } from '../node-manager';
import { HOTKEYS } from './hotkeys';

export function useHotkeys() {
	const [isNodeDragging] = useAtom(nodeDraggingStore.isNodesDraggingAtom);
	const toggleMode = useSetAtom(boardStore.toggleMode);
	const undo = useSetAtom(historyStore.undo);
	const redo = useSetAtom(historyStore.redo);
	const deleteNodes = useSetAtom(nodeManagerStore.deleteNodes);
	const copyNodes = useSetAtom(nodeManagerStore.copyNodes);
	const pasteNodes = useSetAtom(nodeManagerStore.pasteNodes);

	function handleHotkeys(event: React.KeyboardEvent) {
		if (isNodeDragging) {
			return;
		}

		if (event.key === 'Escape') {
			toggleMode('selection', false);
		}

		if (event.code === 'KeyS') {
			toggleMode('selection');
		}

		hotkey(event, () => toggleMode('add-shape-node'), HOTKEYS['add-shape-node']);
        hotkey(event, () => toggleMode('add-text-node'), HOTKEYS['add-text-node']);
        hotkey(event, undo, HOTKEYS['undo']);
        hotkey(event, redo, HOTKEYS['redo']);
        hotkey(event, copyNodes, HOTKEYS['copy-nodes']);
        hotkey(event, pasteNodes, HOTKEYS['paste-nodes']);
        hotkey(event, deleteNodes, HOTKEYS['delete-nodes']);
	}

	return { handleHotkeys };
}
