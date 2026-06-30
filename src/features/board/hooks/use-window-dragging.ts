import * as React from 'react';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { useAtom, useSetAtom } from 'jotai';
import { boardState } from '../model';
import { hasMinDragDistance } from '../helpers';
import type { ElementRect } from '@/shared/hooks/use-element-rect';
import type { Position } from '../model/types';

export function useWindowDragging(canvasRect: ElementRect | null) {
	const [isDragging, setIsDragging] = React.useState<boolean>(false);
	const [isRealDragging, setIsRealDragging] = useAtom(boardState.isWindowDraggingAtom);
	const [isNodesDragging] = useAtom(boardState.isNodesDraggingAtom);
	const [isRect] = useAtom(boardState.isRectAtom);
	const [windowPosition, setWindowPosition] = useAtom(boardState.windowPositionAtom);
	const [mode] = useAtom(boardState.modeAtom);
	const setHasWindowDragging = useSetAtom(boardState.hasWindowDraggingAtom);

	const startCursorPositionRef = React.useRef<Position | null>(null);
	const startWindowPositionRef = React.useRef<Position | null>(null);

	const handlePointerDown = useStableCallback((event: React.PointerEvent) => {
		if (
			!canvasRect ||
			isNodesDragging ||
			isRect ||
			(event.button !== 0 && event.button !== 2) ||
			(event.button === 0 && mode !== 'idle')
		) {
			return;
		}

		const startPosition = { x: event.clientX, y: event.clientY };

		startCursorPositionRef.current = startPosition;
		setIsDragging(true);
		setHasWindowDragging(false);
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		const startPos = startCursorPositionRef.current;

		if (!canvasRect || !isDragging || !startPos) {
			return;
		}

		const currentPos = { x: event.clientX, y: event.clientY };

		if (!isRealDragging) {
			if (hasMinDragDistance(startPos, currentPos)) {
				startCursorPositionRef.current = { ...currentPos };
				startWindowPositionRef.current = { ...windowPosition };
				setIsRealDragging(true);
				setHasWindowDragging(true);
			}
			return;
		}

		const startWindowPosition = startWindowPositionRef.current;

		if (!startWindowPosition) {
			return;
		}

		const diffPosX = (startPos.x - currentPos.x) / windowPosition.zoom;
		const diffPosY = (startPos.y - currentPos.y) / windowPosition.zoom;

		setWindowPosition(prev => ({
			...prev,
			x: startWindowPosition.x + diffPosX,
			y: startWindowPosition.y + diffPosY,
		}));
	});

	const handlePointerUp = React.useCallback(() => {
		setIsDragging(false);
		setIsRealDragging(false);
		startCursorPositionRef.current = null;
		startWindowPositionRef.current = null;
	}, []);

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);

			return () => {
				document.removeEventListener('pointermove', handlePointerMove);
				document.removeEventListener('pointerup', handlePointerUp);
			};
		}
	}, [handlePointerMove, handlePointerUp, isDragging]);

	return { onPointerDown: handlePointerDown };
}
