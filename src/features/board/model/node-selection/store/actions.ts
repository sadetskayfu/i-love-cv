import { atom } from 'jotai';
import { boardStore } from '../../board';
import { nodeCustomizationStore } from '../../node-customization';
import { candidateNodeIdsAtom, selectedNodeIdsAtom } from './state';

export const clearSelectedNodes = atom(null, (get, set) => {
	const selectedNodeIds = get(selectedNodeIdsAtom);

	if (selectedNodeIds.size > 0) {
		set(selectedNodeIdsAtom, new Set());
		set(nodeCustomizationStore.nodeIdInEditAtom, null);
	}
});

export const clearCandidateNodes = atom(null, (get, set) => {
	const candidateNodeIds = get(candidateNodeIdsAtom);

	if (candidateNodeIds.size > 0) {
		set(candidateNodeIdsAtom, new Set());
	}
});

export const selectNodes = atom(
	null,
	(get, set, nodeIds: string[], mod: 'replace' | 'add' | 'toggle') => {
		const mode = get(boardStore.modeAtom);

		if (mode !== 'selection') {
			return;
		}

		if (mod === 'replace') {
			const selectedIds = get(selectedNodeIdsAtom);
			const newSelectedIds = new Set(nodeIds);

			if (nodeIds.length === 1 && selectedIds.size === 1 && selectedIds.has(nodeIds[0])) {
				return;
			}

			set(selectedNodeIdsAtom, newSelectedIds);

			return;
		}

		const selectedIds = get(selectedNodeIdsAtom);
		const newSelectedIds = new Set(selectedIds);

		if (mod === 'add') {
			nodeIds.forEach(nodeId => {
				newSelectedIds.add(nodeId);
			});
		}

		if (mod === 'toggle') {
			nodeIds.forEach(nodeId => {
				if (newSelectedIds.has(nodeId)) {
					newSelectedIds.delete(nodeId);
				} else {
					newSelectedIds.add(nodeId);
				}
			});
		}

		set(selectedNodeIdsAtom, newSelectedIds);
	}
);
