import type { Position } from '../model/types';

export function hasMinDragDistance(startPos: Position, currentPos: Position) {
	const diffX = currentPos.x - startPos.x
	const diffY = currentPos.y - startPos.y
	const squaredDistance = diffX * diffX + diffY * diffY
	const threshold = 5;
	const squaredThreshold = threshold * threshold;

	return squaredDistance > squaredThreshold
}
