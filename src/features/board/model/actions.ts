import { atom } from 'jotai';
import {
	historyAtom,
	historyIndexAtom,
	modeAtom,
	nodesAtom,
	selectedNodeIdsAtom,
	selectionRectAtom,
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

export const addTextNode = atom(null, (get, set, cursorPosition: Position) => {
	const creationRect = get(selectionRectAtom);

	const newNode: TextNode = {
		id: v4(),
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
});

export const addShapeNode = atom(null, (get, set, cursorPosition: Position) => {
	const creationRect = get(selectionRectAtom);

	const newNode: ShapeNode = {
		id: v4(),
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
	};

	set(updateNodes, prev => [...prev, newNode]);
});

export const toggleMode = atom(null, (get, set, mode: Mode, toggled: boolean = true) => {
	const currentMode = get(modeAtom);

	if (toggled && currentMode === mode) {
		set(modeAtom, 'idle');
		set(clearSelectedNodes);
		console.log('go to idle');
	} else {
		set(modeAtom, mode);
		set(clearSelectedNodes);
		console.log(`go to ${mode}`);
	}
});

export const clearSelectedNodes = atom(null, (_, set) => {
	set(selectedNodeIdsAtom, new Set());
});

export const selectNodes = atom(
	null,
	(get, set, nodeIds: string[], mod: 'replace' | 'add' | 'toggle') => {
		const mode = get(modeAtom);

		if (mode !== 'selection') {
			return;
		}

		if (mod === 'replace') {
			const newSelectedIds = new Set(nodeIds);

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
