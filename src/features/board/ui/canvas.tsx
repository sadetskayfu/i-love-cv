import { useAtom, useSetAtom } from 'jotai';
import { Overlay } from './overlay';
import { boardActions, boardState } from '../model';
import { useBoardContext } from './board-context';
import { positionOnScreenToCanvas } from '../helpers';
import { cn } from 'tailwind-variants';
import { useWindowDragging } from '../hooks/use-window-dragging';
import { BoardContextMenu } from './board-context-menu';

export function Canvas({ children, ref, ...otherProps }: React.ComponentProps<'div'>) {
	const [windowPosition] = useAtom(boardState.windowPositionAtom);
	const [isWindowDragging] = useAtom(boardState.isWindowDraggingAtom);
	const [mode] = useAtom(boardState.modeAtom);
	const addTextNode = useSetAtom(boardActions.addTextNode);
	const addShapeNode = useSetAtom(boardActions.addShapeNode);
	const toggleMode = useSetAtom(boardActions.toggleMode);

	const { canvasRect } = useBoardContext();

	const { onPointerDown: handleWindowDraggingPointerDown } = useWindowDragging(canvasRect);

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

				if (mode === 'add-text-node') {
					addTextNode(
						positionOnScreenToCanvas(
							{ x: event.clientX, y: event.clientY },
							windowPosition,
							canvasRect
						)
					);
					toggleMode('selection', false, false);
				}

				if (mode === 'add-shape-node') {
					addShapeNode(
						positionOnScreenToCanvas(
							{ x: event.clientX, y: event.clientY },
							windowPosition,
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
					transform: `scale(${windowPosition.zoom}) translate(${-windowPosition.x}px, ${-windowPosition.y}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
}
