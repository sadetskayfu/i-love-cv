import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
	createRectFromPositions,
	hasMinDragDistance,
	positionOnScreenToCanvas,
} from '@/features/board/helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { boardStore } from '../../board';
import { nodeManagerStore } from '../../node-manager/store';
import { windowStore } from '../../window';
import type { Position } from '../../types';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

export function useCreationRect(canvasRect: ElementRect | null) {
	const [mode] = useAtom(boardStore.modeAtom);
	const [isCreation, setIsCreation] = React.useState<boolean>(false);
	const [isRealCreation, setIsRealCreation] = useAtom(nodeManagerStore.isCreationRectAtom);
	const [windowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);
	const setCreationRect = useSetAtom(nodeManagerStore.creationRectAtom);

	const startCursorPositionRef = React.useRef<Position | null>(null);

	const handlePointeDown = useStableCallback((event: React.PointerEvent) => {
		if (!canvasRect || event.button !== 0 || mode === 'selection' || mode === 'idle') {
			return;
		}

		const selection = window.getSelection();

		if (selection) {
			selection.removeAllRanges();
		}

		const startCursorPosition = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			zoom,
			canvasRect
		);

		startCursorPositionRef.current = startCursorPosition;
		setIsCreation(true);
		setCreationRect(null);
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		const startCursorPos = startCursorPositionRef.current;

		if (!canvasRect || !isCreation || !startCursorPos) {
			return;
		}

		const currentCursorPos = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			zoom,
			canvasRect
		);

		if (!isRealCreation) {
			let needContinue = false;

			if (hasMinDragDistance(startCursorPos, currentCursorPos)) {
				setIsRealCreation(true);
			}

			if (!needContinue) {
				return;
			}
		}

		const rect = createRectFromPositions(startCursorPos, currentCursorPos);

		setCreationRect(rect);
	});

	const handlePointerUp = useStableCallback(() => {
		startCursorPositionRef.current = null;
		setIsRealCreation(false);
		setIsCreation(false);
	});

	React.useEffect(() => {
		if (isCreation) {
			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);

			return () => {
				document.removeEventListener('pointermove', handlePointerMove);
				document.removeEventListener('pointerup', handlePointerUp);
			};
		}
	}, [handlePointerMove, handlePointerUp, isCreation]);

	return { handleCreationRectPointerDown: handlePointeDown };
}
