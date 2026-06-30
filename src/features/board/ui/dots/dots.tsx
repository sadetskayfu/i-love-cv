import * as React from 'react';
import { useAtom } from 'jotai';
import { boardState } from '../../model';
import './dots.css';

export function Dots() {
	const [showGrid] = useAtom(boardState.showGrid)
	const [windowPosition] = useAtom(boardState.windowPositionAtom);
	
	const baseGridSize = windowPosition.zoom <= 0.6 ? 40 : 20;
	const baseBackgroundPosition = windowPosition.zoom <= 0.6 ? -6 : 0
	//const dotSize = Math.max(1.5, windowPosition.zoom * 1.5);
	const dotSize = windowPosition.zoom <= 0.6 ? 3 : 1.5
	const windowX = windowPosition.x * -1 * windowPosition.zoom
	const windowY = windowPosition.y * -1 * windowPosition.zoom

	if (!showGrid) {
		return null
	}

	return (
		<div
			style={
				{
					'--grid-size': baseGridSize * windowPosition.zoom + 'px',
					'--dot-size': `${dotSize * windowPosition.zoom}px`,
					backgroundPosition: `${windowX + baseBackgroundPosition}px ${windowY + baseBackgroundPosition}px`,
				} as React.CSSProperties
			}
			className="dots absolute inset-0"
		/>
	);
}
