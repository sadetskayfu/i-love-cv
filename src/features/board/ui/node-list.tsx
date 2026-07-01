import * as React from 'react';
import { useAtom } from 'jotai';
import { nodeManagerStore, useNodes } from '../model/node-manager';
import { ShapeNode } from './nodes/shape-node';

export const NodeList = React.memo(function NodeList() {
	const [nodes] = useAtom(nodeManagerStore.nodesAtom);
	const { nodeRef } = useNodes();

	return (
		<React.Fragment>
			{nodes.map(node => {
				if (node.type === 'shape') {
					return <ShapeNode key={node.id} id={node.id} ref={nodeRef} />;
				}
				if (node.type === 'text') {
					return null;
				}
			})}
		</React.Fragment>
	);
});
