import * as React from 'react';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { useAtom, useSetAtom } from 'jotai';
import { boardState } from '../model';
import { positionOnScreenToCanvas } from '../helpers';
import type { ElementRect } from '@/shared/hooks/use-element-rect';
import type { WindowPosition } from '../model/types';

const zoomSteps: number[] = [0.2, 0.33, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];
const minZoom = zoomSteps[0];
const maxZoom = zoomSteps[zoomSteps.length - 1];
const factor = 1.2;

function getNextStep(currentZoom: number, direction: 'in' | 'out'): number {
	if (direction === 'in') {
		for (const step of zoomSteps) {
			if (step > currentZoom) return step;
		}
		return maxZoom;
	} else {
		for (let i = zoomSteps.length - 1; i >= 0; i--) {
			if (zoomSteps[i] < currentZoom) return zoomSteps[i];
		}
		return minZoom;
	}
}

function zoomToCenter(
	prevWindowPosition: WindowPosition,
	newZoom: number,
	canvasRect: ElementRect
): WindowPosition {
	const centerX = canvasRect.width / 2;
	const centerY = canvasRect.height / 2;

	const canvasCenterX = prevWindowPosition.x + centerX / prevWindowPosition.zoom;
	const canvasCenterY = prevWindowPosition.y + centerY / prevWindowPosition.zoom;

	const newX = canvasCenterX - centerX / newZoom;
	const newY = canvasCenterY - centerY / newZoom;

	return { x: newX, y: newY, zoom: newZoom };
}

export function useWindowZoom(canvasRect: ElementRect | null) {
	const [isWindowDragging] = useAtom(boardState.isWindowDraggingAtom);
	const [isNodesDragging] = useAtom(boardState.isNodesDraggingAtom);
	const [isRect] = useAtom(boardState.isRectAtom);
	const setWindowPosition = useSetAtom(boardState.windowPositionAtom);

	const handleWheel = useStableCallback((event: WheelEvent) => {
		if (!canvasRect || isWindowDragging || isNodesDragging || isRect) {
			return;
		}

		setWindowPosition(windowPosition => {
			const step = event.deltaY > 0 ? 1 / factor : factor;

			const newZoom = Math.min(maxZoom, Math.max(minZoom, windowPosition.zoom * step));

			if (windowPosition.zoom === newZoom) {
				return windowPosition;
			}

			console.log(newZoom);

			const startCursorPos = positionOnScreenToCanvas(
				{ x: event.clientX, y: event.clientY },
				windowPosition,
				canvasRect
			);
			const currentCursorPos = positionOnScreenToCanvas(
				{ x: event.clientX, y: event.clientY },
				{ ...windowPosition, zoom: newZoom },
				canvasRect
			);

			const diffX = startCursorPos.x - currentCursorPos.x;
			const diffY = startCursorPos.y - currentCursorPos.y;

			return {
				x: windowPosition.x + diffX,
				y: windowPosition.y + diffY,
				zoom: newZoom,
			};
		});
	});

	const handleZoomOut = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		setWindowPosition(prev => {
			const newZoom = getNextStep(prev.zoom, 'out');
			return zoomToCenter(prev, newZoom, canvasRect);
		});
	});

	const handleZoomIn = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		setWindowPosition(prev => {
			const newZoom = getNextStep(prev.zoom, 'in');
			return zoomToCenter(prev, newZoom, canvasRect);
		});
	});

	const handleZoomReset = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		setWindowPosition(prev => zoomToCenter(prev, 1, canvasRect));
	});

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isCtrl = event.ctrlKey || event.metaKey;

			if (!isCtrl) {
				return;
			}

			switch (event.key) {
				case '=':
				case '+':
					event.preventDefault();
					handleZoomIn();
					break;
				case '-':
					event.preventDefault();
					handleZoomOut();
					break;
				case '0':
					event.preventDefault();
					handleZoomReset();
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [handleZoomIn, handleZoomOut, handleZoomReset]);

	React.useEffect(() => {
		document.addEventListener('wheel', handleWheel);

		return () => {
			document.removeEventListener('wheel', handleWheel);
		};
	}, [handleWheel]);

	return { handleZoomIn, handleZoomOut, handleZoomReset };
}
