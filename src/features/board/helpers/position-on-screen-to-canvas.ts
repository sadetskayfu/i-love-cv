import type { Position } from '../model/types';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

export function positionOnScreenToCanvas(
	position: Position,
	windowPosition: Position,
	zoom: number,
	canvasRect?: ElementRect
): Position {
	if (!canvasRect) {
		return position;
	}

	return {
		x: (position.x - canvasRect.x) / zoom + windowPosition.x,
		y: (position.y - canvasRect.y) / zoom + windowPosition.y,
	};
}
