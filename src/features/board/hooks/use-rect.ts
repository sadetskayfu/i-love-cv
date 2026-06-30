import * as React from 'react';
import { useAtom } from 'jotai';
import { boardState } from '../model';
import { hasMinDragDistance, positionOnScreenToCanvas } from '../helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import type { ElementRect } from '@/shared/hooks/use-element-rect';
import type { Position, Rect } from '../model/types';

function createRectFromPositions(startPos: Position, currentPos: Position): Rect {
	let x = Math.min(startPos.x, currentPos.x);
	let y = Math.min(startPos.y, currentPos.y);
	let width = Math.abs(currentPos.x - startPos.x);
	let height = Math.abs(currentPos.y - startPos.y);

	return {
		position: {
			x,
			y,
		},
		size: {
			width,
			height,
		},
	};
}

export function useRect(canvasRect: ElementRect | null) {
	const [isRect, setIsRect] = React.useState<boolean>(false);
	const [isRealRect, setIsRealRect] = useAtom(boardState.isRectAtom)
	const [mode] = useAtom(boardState.modeAtom);
	const [windowPosition] = useAtom(boardState.windowPositionAtom);

	const startPositionRef = React.useRef<Position | null>(null);

	const onPointerDown = React.useCallback(
		(event: React.PointerEvent, fn?: (event: React.PointerEvent) => void) => {
			if (!canvasRect || event.button !== 0 || mode === 'idle') {
				return;
			}

			const selection = window.getSelection();

			if (selection) {
				selection.removeAllRanges();
			}

			const startPosition = positionOnScreenToCanvas(
				{ x: event.clientX, y: event.clientY },
				windowPosition,
				canvasRect
			);

			startPositionRef.current = startPosition;
			setIsRect(true);
            fn?.(event)
		},
		[canvasRect, windowPosition, mode]
	);

	const onPointerMove = useStableCallback(
		(event: PointerEvent, fn?: (event: PointerEvent, rect: Rect | null) => void) => {
			const startPos = startPositionRef.current;

			if (!canvasRect || !isRect || !startPos) {
				return null;
			}

			const currentPos = positionOnScreenToCanvas(
				{ x: event.clientX, y: event.clientY },
				windowPosition,
				canvasRect
			);

			if (!isRealRect) {
				if (hasMinDragDistance(startPos, currentPos)) {
					setIsRealRect(true);
				}
				return null;
			}

			const rect = createRectFromPositions(startPos, currentPos);
			fn?.(event, rect);
		}
	);

	const onPointerUp = useStableCallback(
		(event: PointerEvent, fn?: (event: PointerEvent) => void) => {
			if (isRect) {
				startPositionRef.current = null;
				setIsRealRect(false);
				setIsRect(false);
				fn?.(event);
			}
		}
	);

	return { onPointerDown, onPointerMove, onPointerUp };
}
