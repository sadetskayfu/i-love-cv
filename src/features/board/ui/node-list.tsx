import * as React from 'react';
import { useAtom } from 'jotai';
import { boardState } from '../model';
import { useNodes } from '../hooks/use-nodes';
import { ShapeNode } from './nodes/shape-node';

export const NodeList = React.memo(function NodeList() {
	const [nodes] = useAtom(boardState.nodesAtom);
	const { nodeRef } = useNodes();

	console.log('Node list rerender', nodes);

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
