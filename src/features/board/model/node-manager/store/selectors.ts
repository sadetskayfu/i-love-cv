import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { copiedNodesAtom, nodesAtom } from './state';

export const nodeById = atomFamily((id: string) =>
	atom(get => get(nodesAtom).find(node => node.id === id))
);

export const hasCopiedNodes = atom(get => {
	const copiedNodes = get(copiedNodesAtom);

	if (copiedNodes.length > 0) {
		return true;
	}
	return false;
});
