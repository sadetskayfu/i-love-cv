import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { nodeIdInEditAtom } from './state';

export const isNodeInEditMode = atomFamily((nodeId: string) =>
	atom(get => {
		const nodeIdInEdit = get(nodeIdInEditAtom);
		return nodeIdInEdit === nodeId;
	})
);
