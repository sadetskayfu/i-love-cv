import type { Position, Rect } from '../model/types';

export function createRectFromPositions(startPos: Position, currentPos: Position): Rect {
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
