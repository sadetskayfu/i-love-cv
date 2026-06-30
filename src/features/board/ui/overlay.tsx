import * as React from 'react';
import { useSetAtom } from 'jotai';
import { boardActions } from '../model';
import { useBoardContext } from './board-context';
import { useSelectionRect } from '../hooks/use-selection-rect';
import { useCreatingRect } from '../hooks/use-creating-rect';

export function Overlay (
	{ ref, onPointerDown,...otherProps }: React.ComponentProps<'div'>
) {
	const clearSelectedNodes = useSetAtom(boardActions.clearSelectedNodes);

	const { canvasRect} = useBoardContext();

	const { onSelectionRectPointerDown } = useSelectionRect(canvasRect);
	const { onCreatingRectPointerDown } = useCreatingRect(canvasRect)

	return (
		<div
			ref={ref}
			className="absolute inset-0"
			onPointerDown={event => {
				if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
					clearSelectedNodes();
				}

				onSelectionRectPointerDown(event);
				onCreatingRectPointerDown(event)
				onPointerDown?.(event)
			}}
			{...otherProps}
		/>
	);
}
