import * as React from 'react';
import { useSetAtom } from 'jotai';
import { nodeManagerStore } from '../store';

export function useNodes() {
	const setNodes = useSetAtom(nodeManagerStore.domNodesAtom);

	const nodeRef: React.RefCallback<HTMLElement> = React.useCallback(el => {
		if (el) {
			setNodes(prev => {
				const newNodes = { ...prev };
				const nodeId = el.dataset.id;

				if (nodeId) {
					newNodes[nodeId] = el;
					return newNodes;
				}

				return prev;
			});

			return () => {
				setNodes(prev => {
					const newNodes = { ...prev };
					const nodeId = el.dataset.id;

					if (nodeId) {
						delete newNodes[nodeId];
						return newNodes;
					}

					return prev;
				});
			};
		}
	}, []);

	return { nodeRef };
}
