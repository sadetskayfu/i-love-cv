import type { ElementRect } from '@/shared/hooks/use-element-rect';
import type { Position, WindowPosition } from '../model/types';

export function positionOnScreenToCanvas(
	position: Position,
	windowPosition: WindowPosition,
	canvasRect?: ElementRect
): Position {
	if (!canvasRect) {
		return position;
	}

	return {
		x: (position.x - canvasRect.x) / windowPosition.zoom + windowPosition.x,
		y: (position.y - canvasRect.y) / windowPosition.zoom + windowPosition.y,
	};
}
