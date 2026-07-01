import { useAtom, useSetAtom } from 'jotai';
import { cn } from 'tailwind-variants';
import { positionOnScreenToCanvas } from '../helpers';
import { boardStore } from '../model/board';
import { nodeManagerStore } from '../model/node-manager';
import { useWindowDragging, windowStore } from '../model/window';
import { useBoardContext } from './board-context';
import { BoardContextMenu } from './board-context-menu';
import { Overlay } from './overlay';

export function Canvas({ children, ref, ...otherProps }: React.ComponentProps<'div'>) {
	const [windowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);
	const [isWindowDragging] = useAtom(windowStore.isWindowDraggingAtom);
	const [mode] = useAtom(boardStore.modeAtom);
	const addShapeNode = useSetAtom(nodeManagerStore.addShapeNode);
	const toggleMode = useSetAtom(boardStore.toggleMode);

	const { canvasRect } = useBoardContext();

	const { handleWindowDraggingPointerDown } = useWindowDragging(canvasRect);

	return (
		<div
			className={cn('absolute inset-0 touch-none overflow-hidden', {
				'cursor-grabbing': isWindowDragging || mode === 'idle',
			})}
			ref={ref}
			onPointerDown={handleWindowDraggingPointerDown}
			onPointerUp={event => {
				if (!canvasRect || event.button !== 0) {
					return;
				}

				if (mode === 'add-shape-node') {
					addShapeNode(
						positionOnScreenToCanvas(
							{ x: event.clientX, y: event.clientY },
							windowPosition,
							zoom,
							canvasRect
						)
					);
					toggleMode('selection', false, false);
				}
			}}
			{...otherProps}
		>
			<BoardContextMenu>
				<Overlay />
			</BoardContextMenu>
			<div
				className="origin-top-left"
				style={{
					transform: `scale(${zoom}) translate(${-windowPosition.x}px, ${-windowPosition.y}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
}
