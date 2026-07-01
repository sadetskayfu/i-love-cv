import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { nodeManagerStore } from '../../node-manager/store';
import { candidateNodeIdsAtom, selectedNodeIdsAtom } from './state';

export const hasSelectedNodes = atom(get => {
	const selectedNodeIds = get(selectedNodeIdsAtom);

	return selectedNodeIds.size > 0;
});

export const isOnlyOneSelected = atomFamily((nodeId: string) =>
	atom(get => {
		const selectedNodeIds = get(selectedNodeIdsAtom);

		return selectedNodeIds.size === 1 && selectedNodeIds.has(nodeId);
	})
);

export const selectedDomNodes = atom(get => {
	const nodes = get(nodeManagerStore.domNodesAtom);
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

export const candidateDomNodes = atom(get => {
	const nodes = get(nodeManagerStore.domNodesAtom);
	const candidateNodeIds = get(candidateNodeIdsAtom);

	const candidateNodes: HTMLElement[] = [];

	candidateNodeIds.forEach(id => {
		const node = nodes[id];

		if (node) {
			candidateNodes.push(node);
		}
	});

	return candidateNodes;
});

export const unselectedDomNodes = atom(get => {
	const nodes = get(nodeManagerStore.domNodesAtom);
	const selectedNodeIds = get(selectedNodeIdsAtom);

	return Object.keys(nodes)
		.filter(key => !selectedNodeIds.has(key))
		.map(key => nodes[key]);
});
