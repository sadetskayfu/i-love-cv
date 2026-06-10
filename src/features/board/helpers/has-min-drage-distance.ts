import type { Position } from '../model/types';

export function hasMinDragDistance(startPos: Position, endPos: Position) {
	const diffPosX = Math.abs(startPos.x - endPos.x);
	const diffPosY = Math.abs(startPos.y - endPos.y);

	if (diffPosX > 4 || diffPosY > 4) {
		return true;
	}

	return false;
}
