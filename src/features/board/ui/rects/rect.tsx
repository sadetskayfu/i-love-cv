import { useAtom } from 'jotai';
import { windowStore } from '../../model/window';
import type { Rect } from '../../model/types';

export function Rect({ rect }: { rect: Rect }) {
	const [windowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);

	return (
		<div
			className="pointer-events-none absolute bg-green-600/10 outline-1 -outline-offset-1 outline-green-600"
			style={{
				transform: `translate(
					${(rect.position.x - windowPosition.x) * zoom}px, 
					${(rect.position.y - windowPosition.y) * zoom}px
				)`,
				width: rect.size.width * zoom + 'px',
				height: rect.size.height * zoom + 'px',
			}}
		/>
	);
}
