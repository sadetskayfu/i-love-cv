import * as React from 'react';
import { useSetAtom } from 'jotai';
import { useCreationRect } from '../model/node-manager';
import { nodeSelectionStore, useSelectionRect } from '../model/node-selection';
import { useBoardContext } from './board-context';

export function Overlay({ ref, onPointerDown, ...otherProps }: React.ComponentProps<'div'>) {
	const clearSelectedNodes = useSetAtom(nodeSelectionStore.clearSelectedNodes);

	const { canvasRect } = useBoardContext();

	const { handleSelectionRectPointerDown } = useSelectionRect(canvasRect);
	const { handleCreationRectPointerDown } = useCreationRect(canvasRect);

	return (
		<div
			ref={ref}
			className="absolute inset-0"
			onPointerDown={event => {
				if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
					clearSelectedNodes();
				}

				handleCreationRectPointerDown(event);
				handleSelectionRectPointerDown(event);
				onPointerDown?.(event);
			}}
			{...otherProps}
		/>
	);
}
