import { atom } from 'jotai';
import {
	copiedNodesAtom,
	creatingRectAtom,
	historyAtom,
	historyIndexAtom,
	modeAtom,
	nodeIdInEditAtom,
	nodesAtom,
	selectedNodeIdsAtom,
	visualSelectedNodeIdsAtom,
	windowPositionAtom,
} from './state';
import { hasRedo, hasUndo } from './selectors';
import { v4 } from 'uuid';
import { MIN_TEXT_NODE_WIDTH, MIN_SHAPE_NODE_SIZE } from '../constants';
import { updateStoredNodes, templateState } from '@/features/templates';
import type { Mode, Position, Node, ShapeNode, TextNode } from './types';

// --- Node manager ---
export const updateNodes = atom(
	null,
	(get, set, nodes: Node[] | ((nodes: Node[]) => Node[]), historyPush: boolean = true) => {
		set(nodesAtom, prevNodes => {
			const resolveNodes = typeof nodes === 'function' ? nodes(prevNodes) : nodes;

			const templateId = get(templateState.activeTemplateIdAtom);

			if (templateId) {
				updateStoredNodes(templateId, resolveNodes);
			}

			if (historyPush) {
				const history = get(historyAtom);
				const historyIndex = get(historyIndexAtom);

				const croppedHistory = history.slice(0, historyIndex + 1);
				const newHistory = [...croppedHistory, resolveNodes];

				set(historyAtom, newHistory);
				set(historyIndexAtom, historyIndex + 1);
			}

			return resolveNodes;
		});
	}
);

export const deleteNodes = atom(null, (get, set) => {
	const nodes = get(nodesAtom);
	const selectedNodeIds = get(selectedNodeIdsAtom);

	if (selectedNodeIds.size === 0) {
		return;
	}

	const newNodes = nodes.filter(node => !selectedNodeIds.has(node.id));

	set(updateNodes, newNodes);
	set(clearSelectedNodes);
});

export const copyNodes = atom(null, (get, set) => {
	const nodes = get(nodesAtom);
	const selectedNodeIds = get(selectedNodeIdsAtom);

	if (selectedNodeIds.size === 0) {
		return;
	}

	const copiedNodes = nodes.filter(node => selectedNodeIds.has(node.id));

	set(copiedNodesAtom, copiedNodes);
});

export const pasteNodes = atom(null, (get, set) => {
	const nodes = get(nodesAtom);
	const copiedNodes = get(copiedNodesAtom);

	if (copiedNodes.length === 0) {
		return;
	}

	const selectedIds = new Set<string>();
	const nodesToPaste = copiedNodes.map(node => {
		const id = v4();
		selectedIds.add(id);
		return { ...node, id };
	});

	set(updateNodes, [...nodes, ...nodesToPaste]);
	set(selectedNodeIdsAtom, selectedIds);
});

export const addTextNode = atom(null, (get, set, cursorPosition: Position) => {
	const creationRect = get(creatingRectAtom);

	const id = v4();
	const newNode: TextNode = {
		id,
		type: 'text',
		position: {
			x: creationRect ? creationRect.position.x : cursorPosition.x,
			y: creationRect ? creationRect.position.y : cursorPosition.y,
		},
		width: creationRect ? Math.max(creationRect.size.width, MIN_TEXT_NODE_WIDTH) : undefined,
		rotate: 0,
		content: 'Text',
		font: {
			bold: false,
			color: '1',
			size: '16',
		},
	};

	set(updateNodes, prev => [...prev, newNode]);
	set(selectedNodeIdsAtom, new Set([id]));
	set(nodeIdInEditAtom, id);
	set(creatingRectAtom, null);
});

export const addShapeNode = atom(null, (get, set, cursorPosition: Position) => {
	const creationRect = get(creatingRectAtom);

	const id = v4();
	const newNode: ShapeNode = {
		id,
		type: 'shape',
		position: {
			x: creationRect ? creationRect.position.x : cursorPosition.x,
			y: creationRect ? creationRect.position.y : cursorPosition.y,
		},
		dimensions: {
			width: creationRect
				? Math.max(creationRect.size.width, MIN_SHAPE_NODE_SIZE)
				: MIN_SHAPE_NODE_SIZE,
			height: creationRect
				? Math.max(creationRect.size.height, MIN_SHAPE_NODE_SIZE)
				: MIN_SHAPE_NODE_SIZE,
		},
		rotate: 0,
		content: [{ type: 'paragraph', children: [{ text: '', fontColor: 1, backgroundColor: 1 }] }],
	};

	set(updateNodes, prev => [...prev, newNode]);
	set(selectedNodeIdsAtom, new Set([id]));
	set(nodeIdInEditAtom, id);
	set(creatingRectAtom, null);
});

export const toggleMode = atom(
	null,
	(get, set, mode: Mode, toggled: boolean = true, clearSelection: boolean = true) => {
		const currentMode = get(modeAtom);

		if (toggled && currentMode === mode) {
			set(modeAtom, 'idle');

			if (clearSelection) {
				set(clearSelectedNodes);
			}
		} else {
			set(modeAtom, mode);

			if (clearSelection) {
				set(clearSelectedNodes);
			}
		}
	}
);

export const clearSelectedNodes = atom(null, (get, set) => {
	const selectedNodeIds = get(selectedNodeIdsAtom);

	if (selectedNodeIds.size > 0) {
		console.log('clear selected nodes');
		set(selectedNodeIdsAtom, new Set());
		set(nodeIdInEditAtom, null);
	}
});

export const clearVisualSelectedNodes = atom(null, (get, set) => {
	const selectedNodeIds = get(visualSelectedNodeIdsAtom);

	if (selectedNodeIds.size > 0) {
		set(visualSelectedNodeIdsAtom, new Set());
	}
});

export const selectNodes = atom(
	null,
	(get, set, nodeIds: string[], mod: 'replace' | 'add' | 'toggle') => {
		const mode = get(modeAtom);

		console.trace();

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

export const resetWindowPosition = atom(null, (_, set) => {
	set(windowPositionAtom, { x: 0, y: 0, zoom: 1 });
});

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
	set(updateNodes, history[historyIndex - 1], false);
	set(clearSelectedNodes);
});

export const redo = atom(null, (get, set) => {
	const history = get(historyAtom);
	const historyIndex = get(historyIndexAtom);

	if (!get(hasRedo)) {
		return;
	}

	set(historyIndexAtom, historyIndex + 1);
	set(updateNodes, history[historyIndex + 1], false);
	set(clearSelectedNodes);
});
