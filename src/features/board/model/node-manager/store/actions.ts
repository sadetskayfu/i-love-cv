import { atom } from 'jotai';
import { v4 } from 'uuid';
import { templateStore, updateStoredNodes } from '@/features/templates';
import { historyStore } from '../../history';
import { nodeCustomizationStore } from '../../node-customization';
import { nodeSelectionStore } from '../../node-selection';
import { MIN_SHAPE_NODE_SIZE } from '../constants';
import { copiedNodesAtom, creationRectAtom, nodesAtom } from './state';
import type { Node, Position, ShapeNode } from '../../types';

export const updateNodes = atom(
	null,
	(get, set, nodes: Node[] | ((nodes: Node[]) => Node[]), historyPush: boolean = true) => {
		set(nodesAtom, prevNodes => {
			const resolveNodes = typeof nodes === 'function' ? nodes(prevNodes) : nodes;

			const templateId = get(templateStore.activeTemplateIdAtom);

			if (templateId) {
				updateStoredNodes(templateId, resolveNodes);
			}

			if (historyPush) {
				const history = get(historyStore.historyAtom);
				const historyIndex = get(historyStore.historyIndexAtom);

				const croppedHistory = history.slice(0, historyIndex + 1);
				const newHistory = [...croppedHistory, resolveNodes];

				set(historyStore.historyAtom, newHistory);
				set(historyStore.historyIndexAtom, historyIndex + 1);
			}

			return resolveNodes;
		});
	}
);

export const deleteNodes = atom(null, (get, set) => {
	const nodes = get(nodesAtom);
	const selectedNodeIds = get(nodeSelectionStore.selectedNodeIdsAtom);

	if (selectedNodeIds.size === 0) {
		return;
	}

	const newNodes = nodes.filter(node => !selectedNodeIds.has(node.id));

	set(updateNodes, newNodes);
	set(nodeSelectionStore.clearSelectedNodes);
});

export const copyNodes = atom(null, (get, set) => {
	const nodes = get(nodesAtom);
	const selectedNodeIds = get(nodeSelectionStore.selectedNodeIdsAtom);

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
	set(nodeSelectionStore.selectedNodeIdsAtom, selectedIds);
});

export const addTextNode = atom(null, () => {
	// const creationRect = get(creatingRectAtom);
	// const id = v4();
	// const newNode: TextNode = {
	// 	id,
	// 	type: 'text',
	// 	position: {
	// 		x: creationRect ? creationRect.position.x : cursorPosition.x,
	// 		y: creationRect ? creationRect.position.y : cursorPosition.y,
	// 	},
	// 	width: creationRect ? Math.max(creationRect.size.width, MIN_TEXT_NODE_WIDTH) : undefined,
	// 	rotate: 0,
	// 	content: 'Text',
	// 	font: {
	// 		bold: false,
	// 		color: '1',
	// 		size: '16',
	// 	},
	// };
	// set(updateNodes, prev => [...prev, newNode]);
	// set(selectedNodeIdsAtom, new Set([id]));
	// set(nodeIdInEditAtom, id);
	// set(creatingRectAtom, null);
});

export const addShapeNode = atom(null, (get, set, cursorPosition: Position) => {
	const creationRect = get(creationRectAtom);

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
		border: {
			width: 1,
			color: 1,
			opacity: 1,
			radius: 0,
		},
		backgroundColor: 1,
		opacity: 1,
		content: [{ type: 'paragraph', children: [{ text: '', fontColor: 1, backgroundColor: 1 }] }],
	};

	set(updateNodes, prev => [...prev, newNode]);
	set(creationRectAtom, null);
	set(nodeSelectionStore.selectedNodeIdsAtom, new Set([id]));
	set(nodeCustomizationStore.nodeIdInEditAtom, id);
});
