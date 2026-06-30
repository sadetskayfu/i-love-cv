import { atom } from 'jotai';
import {
	copiedNodesAtom,
	domNodesAtom,
	historyAtom,
	historyIndexAtom,
	modeAtom,
	nodeIdInEditAtom,
	nodesAtom,
	selectedNodeIdsAtom,
	visualSelectedNodeIdsAtom,
	windowPositionAtom,
} from './state';
import { atomFamily } from 'jotai-family';
import { MAX_ZOOM, MIN_ZOOM } from '../constants';

export const nodeById = atomFamily((id: string) =>
	atom(get => get(nodesAtom).find(node => node.id === id))
);

export const isEditMode = atomFamily((nodeId: string) => atom(get => {
	const nodeIdInEdit = get(nodeIdInEditAtom)
	return nodeIdInEdit === nodeId
}))

export const isOnlyOneSelected = atomFamily((nodeId: string) =>
	atom(get => {
		const selectedNodeIds = get(selectedNodeIdsAtom);

		return selectedNodeIds.size === 1 && selectedNodeIds.has(nodeId);
	})
);

// export const isSelected = atomFamily((id: string) => atom(get => get(selectedNodeIdsAtom).has(id)));

// export const isVisualSelected = atomFamily((id: string) =>
// 	atom(get => get(visualSelectedNodeIdsAtom).has(id))
// );

export const selectedNodes = atom(get => {
	const nodes = get(domNodesAtom);
	const selectedNodeIds = get(selectedNodeIdsAtom);

	const selectedNodes: HTMLElement[] = [];

	selectedNodeIds.forEach(id => {
		const node = nodes[id];

		if (node) {
			selectedNodes.push(node);
		}
	});

	return selectedNodes;
});

export const visualSelectedNodes = atom(get => {
	const nodes = get(domNodesAtom);
	const selectedNodeIds = get(visualSelectedNodeIdsAtom);

	const selectedNodes: HTMLElement[] = [];

	selectedNodeIds.forEach(id => {
		const node = nodes[id];

		if (node) {
			selectedNodes.push(node);
		}
	});

	return selectedNodes;
});



export const unselectedNodes = atom(get => {
	const nodes = get(domNodesAtom);
	const selectedNodeIds = get(selectedNodeIdsAtom);

	return Object.keys(nodes)
		.filter(key => !selectedNodeIds.has(key))
		.map(key => nodes[key]);
});

export const isIdleMode = atom(get => {
	const mode = get(modeAtom);
	return mode === 'idle';
});

export const isSelectionMode = atom(get => {
	const mode = get(modeAtom);
	return mode === 'selection';
});

export const isMinZoom = atom(get => {
	const windowPosition = get(windowPositionAtom);

	return windowPosition.zoom === MIN_ZOOM;
});

export const isMaxZoom = atom(get => {
	const windowPosition = get(windowPositionAtom);

	return windowPosition.zoom === MAX_ZOOM;
});

export const hasCopiedNodes = atom(get => {
	const copiedNodes = get(copiedNodesAtom)

	if (copiedNodes.length > 0) {
		return true
	}
	return false
})

export const windowZoom = atom(get => {
	return get(windowPositionAtom).zoom
})

// --- History ---
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
