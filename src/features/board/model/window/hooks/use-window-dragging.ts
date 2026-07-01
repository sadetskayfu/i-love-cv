import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { hasMinDragDistance } from '@/features/board/helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { boardStore } from '../../board';
import { nodeDraggingStore } from '../../node-dragging';
import { nodeManagerStore } from '../../node-manager';
import { nodeSelectionStore } from '../../node-selection';
import { windowStore } from '../store';
import type { Position } from '../../types';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

export function useWindowDragging(canvasRect: ElementRect | null) {
	const [isDragging, setIsDragging] = React.useState<boolean>(false);
	const [isRealDragging, setIsRealDragging] = useAtom(windowStore.isWindowDraggingAtom);
	const [isNodesDragging] = useAtom(nodeDraggingStore.isNodesDraggingAtom);
	const [isCreationRect] = useAtom(nodeManagerStore.isCreationRectAtom);
	const [isSelectionRect] = useAtom(nodeSelectionStore.isSelectionRectAtom);
	const [windowPosition, setWindowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);
	const [mode] = useAtom(boardStore.modeAtom);
	const setHasWindowDragging = useSetAtom(windowStore.hasWindowDraggingAtom);

	const startCursorPositionRef = React.useRef<Position | null>(null);
	const startWindowPositionRef = React.useRef<Position | null>(null);

	const handlePointerDown = useStableCallback((event: React.PointerEvent) => {
		if (
			!canvasRect ||
			isNodesDragging ||
			isSelectionRect ||
			isCreationRect ||
			(event.button !== 0 && event.button !== 2) ||
			(event.button === 0 && mode !== 'idle')
		) {
			return;
		}

		startCursorPositionRef.current = { x: event.clientX, y: event.clientY };
		startWindowPositionRef.current = { ...windowPosition };
		setIsDragging(true);
		setHasWindowDragging(false);
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		const startCursorPos = startCursorPositionRef.current;
		const startWindowPos = startWindowPositionRef.current;

		if (!canvasRect || !isDragging || !startCursorPos || !startWindowPos) {
			return;
		}

		const currentCursorPos = { x: event.clientX, y: event.clientY };

		if (!isRealDragging) {
			let needContinue = false;

			if (hasMinDragDistance(startCursorPos, currentCursorPos)) {
				startCursorPositionRef.current = { ...currentCursorPos };
				setIsRealDragging(true);
				setHasWindowDragging(true);
				needContinue = true;
			}

			if (!needContinue) {
				return;
			}
		}

		const diffX = (startCursorPos.x - currentCursorPos.x) / zoom;
		const diffY = (startCursorPos.y - currentCursorPos.y) / zoom;

		setWindowPosition({ x: startWindowPos.x + diffX, y: startWindowPos.y + diffY });
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

	return { handleWindowDraggingPointerDown: handlePointerDown };
}
