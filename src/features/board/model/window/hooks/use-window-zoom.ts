import * as React from 'react';
import { useAtom } from 'jotai';
import { positionOnScreenToCanvas } from '@/features/board/helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { nodeDraggingStore } from '../../node-dragging';
import { nodeManagerStore } from '../../node-manager/store';
import { nodeSelectionStore } from '../../node-selection/store';
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, ZOOM_FACTOR, ZOOM_STEPS } from '../constants';
import { windowStore } from '../store';
import type { Position } from '../../types';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

function getNextStep(currentZoom: number, direction: 'in' | 'out'): number {
	if (direction === 'in') {
		for (const step of ZOOM_STEPS) {
			if (step > currentZoom) return step;
		}
		return MAX_ZOOM;
	} else {
		for (let i = ZOOM_STEPS.length - 1; i >= 0; i--) {
			if (ZOOM_STEPS[i] < currentZoom) return ZOOM_STEPS[i];
		}
		return MIN_ZOOM;
	}
}

function zoomToCenter(
	canvasRect: ElementRect,
	prevWindowPosition: Position,
	prevZoom: number,
	newZoom: number
) {
	const centerX = canvasRect.width / 2;
	const centerY = canvasRect.height / 2;

	const canvasCenterX = prevWindowPosition.x + centerX / prevZoom;
	const canvasCenterY = prevWindowPosition.y + centerY / prevZoom;

	const newX = canvasCenterX - centerX / newZoom;
	const newY = canvasCenterY - centerY / newZoom;

	return { x: newX, y: newY };
}

export function useWindowZoom(canvasRect: ElementRect | null) {
	const [isWindowDragging] = useAtom(windowStore.isWindowDraggingAtom);
	const [isNodesDragging] = useAtom(nodeDraggingStore.isNodesDraggingAtom);
	const [isCreationRect] = useAtom(nodeManagerStore.isCreationRectAtom);
	const [isSelectionRect] = useAtom(nodeSelectionStore.isSelectionRectAtom);
	const [windowPosition, setWindowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom, setZoom] = useAtom(windowStore.zoomAtom);

	const handleWheel = useStableCallback((event: WheelEvent) => {
		if (!canvasRect || isWindowDragging || isNodesDragging || isCreationRect || isSelectionRect) {
			return;
		}

		const step = event.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
		const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * step));

		if (zoom === newZoom) {
			return;
		}

		const startCursorPos = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			zoom,
			canvasRect
		);

		const currentCursorPos = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			newZoom,
			canvasRect
		);

		const diffX = startCursorPos.x - currentCursorPos.x;
		const diffY = startCursorPos.y - currentCursorPos.y;

		const newWindowPosition: Position = {
			x: windowPosition.x + diffX,
			y: windowPosition.y + diffY,
		};

		setWindowPosition(newWindowPosition);
		setZoom(newZoom);
	});

	const handleZoomOut = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		const newZoom = getNextStep(zoom, 'out');
		const newWindowPosition = zoomToCenter(canvasRect, windowPosition, zoom, newZoom);

		setWindowPosition(newWindowPosition);
		setZoom(newZoom);
	});

	const handleZoomIn = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		const newZoom = getNextStep(zoom, 'in');
		const newWindowPosition = zoomToCenter(canvasRect, windowPosition, zoom, newZoom);

		setWindowPosition(newWindowPosition);
		setZoom(newZoom);
	});

	const handleZoomReset = useStableCallback(() => {
		if (!canvasRect) {
			return;
		}

		const newWindowPosition = zoomToCenter(canvasRect, windowPosition, zoom, DEFAULT_ZOOM);

		setWindowPosition(newWindowPosition);
		setZoom(DEFAULT_ZOOM);
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
