import * as React from 'react';
import { useAtomValue } from 'jotai';
import { boardSelectors } from '../../model';
import { BaseNode } from './base-node';
import { NodeType } from '../../model/types';

export const ShapeNode = React.memo(function ShapeNode({
	id,
	style,
	...otherProps
}: Omit<BaseNode.Props, 'position' | 'rotate'>) {
	const node = useAtomValue(boardSelectors.nodeById(id));

	if (!node || node.type !== 'shape') {
		return null;
	}

	return (
		<BaseNode
			id={id}
			position={node.position}
			rotate={node.rotate}
			data-type={NodeType.Shape}
			style={{ ...style, width: node.dimensions.width, height: node.dimensions.height }}
			{...otherProps}
		></BaseNode>
	);
});
