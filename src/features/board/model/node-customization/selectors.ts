import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { nodeIdInEditAtom } from './state';
import { nodeManagerStore } from '../node-manager';
import { nodeSelectionStore } from '../node-selection';

export const isNodeInEditMode = atomFamily((nodeId: string) =>
	atom(get => {
		const nodeIdInEdit = get(nodeIdInEditAtom);
		return nodeIdInEdit === nodeId;
	})
);

export const activeBackgroundColor = atom(get => {
    const nodes = get(nodeManagerStore.nodesAtom)
    const selectedNodeIds = get(nodeSelectionStore.selectedNodeIdsAtom)
})