import { useAtom } from 'jotai';
import { boardState } from '../model';

export function SelectionRect() {
	const [selectionRect] = useAtom(boardState.selectionRectAtom);
	const [isSelectionRect] = useAtom(boardState.isSelectionRectAtom);
	const [windowPosition] = useAtom(boardState.windowPositionAtom);

	if (!selectionRect || !isSelectionRect) {
		return null;
	}

	return (
		<div
			className="pointer-events-none absolute bg-blue-500/10 outline-1 -outline-offset-1 outline-blue-500"
			style={{
				transform: `translate(
					${(selectionRect.position.x - windowPosition.x) * windowPosition.zoom}px, 
					${(selectionRect.position.y - windowPosition.y) * windowPosition.zoom}px
				)`,
				width: selectionRect.size.width * windowPosition.zoom + 'px',
				height: selectionRect.size.height * windowPosition.zoom + 'px',
			}}
		/>
	);
}
