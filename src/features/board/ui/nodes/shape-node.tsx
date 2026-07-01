import * as React from 'react';
import { useAtomValue } from 'jotai';
import { useMergedRefs } from '@/shared/hooks/use-merged-refs';
import { Editable } from '@/shared/ui/editable';
import { Popover } from '@/shared/ui/popover';
import { nodeCustomizationStore } from '../../model/node-customization';
import { nodeManagerStore } from '../../model/node-manager';
import { NodeType } from '../../model/types';
import { EditableToolbar } from '../toolbars/editable-toolbar';
import { BaseNode } from './base-node';

export const ShapeNode = React.memo(function ShapeNode({
	ref,
	id,
	style,
	...otherProps
}: Omit<BaseNode.Props, 'position' | 'rotate'>) {
	const nodeRef = React.useRef<HTMLDivElement>(null);
	const editableRef = React.useRef<HTMLDivElement>(null);
	const node = useAtomValue(nodeManagerStore.nodeById(id));
	const isEditMode = useAtomValue(nodeCustomizationStore.isNodeInEditMode(id));

	const mergedRef = useMergedRefs(ref, nodeRef);

	React.useEffect(() => {
		if (isEditMode) {
			//editableRef.current?.focus()
		}
	}, [isEditMode]);

	if (!node || node.type !== 'shape') {
		return null;
	}

	return (
		<BaseNode
			ref={mergedRef}
			id={id}
			position={node.position}
			rotate={node.rotate}
			data-type={NodeType.Shape}
			style={{ ...style, width: node.dimensions.width, height: node.dimensions.height }}
			className="flex items-center justify-center overflow-hidden"
			{...otherProps}
		>
			<Editable.Root
				ref={editableRef}
				initialValue={node.content}
				readonly={!isEditMode}
				fontColors={['#0000ff', '#7f00ff']}
				backgroundColors={[undefined, '#0000ff', '#7f00ff']}
				className="bg-red-500 py-2 px-1 "
			>
				<Popover.Root open={isEditMode}>
					<Popover.Popup
						className="transition-none"
						side="top"
						initialFocus={false}
						anchor={nodeRef}
						sideOffset={60}
					>
						<EditableToolbar />
					</Popover.Popup>
				</Popover.Root>
			</Editable.Root>
		</BaseNode>
	);
});
