import { useSetAtom } from 'jotai';
import { boardActions } from '../model';
import { useBoardContext } from './board-context';
import { useSelectionRect } from '../hooks/use-selection-rect';

export function Overlay() {
	const clearSelectedNodes = useSetAtom(boardActions.clearSelectedNodes);

	const { canvasRect } = useBoardContext();

	const { onPointerDown: handleSelectionRectPointerDown } = useSelectionRect(canvasRect);

	return (
		<div
			className="absolute inset-0"
			onPointerDown={event => {
				if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
					clearSelectedNodes();
				}

				handleSelectionRectPointerDown(event);
			}}
		/>
	);
}
