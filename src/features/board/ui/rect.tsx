import { useAtom } from 'jotai';
import { boardState } from '../model';

export function Rect() {
	const [selectionRect] = useAtom(boardState.selectionRectAtom);
	const [creatingRect] = useAtom(boardState.creatingRectAtom)
	const [isRect] = useAtom(boardState.isRectAtom);
	const [windowPosition] = useAtom(boardState.windowPositionAtom);

	if (!isRect || (!selectionRect && !creatingRect)) {
		return null;
	}

	const rect = selectionRect || creatingRect

	if (!rect) {
		return null
	}

	return (
		<div
			className="pointer-events-none absolute bg-blue-500/10 outline-1 -outline-offset-1 outline-blue-500"
			style={{
				transform: `translate(
					${(rect.position.x - windowPosition.x) * windowPosition.zoom}px, 
					${(rect.position.y - windowPosition.y) * windowPosition.zoom}px
				)`,
				width: rect.size.width * windowPosition.zoom + 'px',
				height: rect.size.height * windowPosition.zoom + 'px',
			}}
		/>
	);
}
