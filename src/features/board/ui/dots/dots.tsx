import * as React from 'react';
import { useAtom } from 'jotai';
import { boardStore } from '../../model/board';
import { windowStore } from '../../model/window';
import './dots.css';

export function Dots() {
	const [showGrid] = useAtom(boardStore.showGrid);
	const [windowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);

	const baseGridSize = zoom <= 0.6 ? 40 : 20;
	const baseBackgroundPosition = zoom <= 0.6 ? -6 : 0;
	//const dotSize = Math.max(1.5, windowPosition.zoom * 1.5);
	const dotSize = zoom <= 0.6 ? 3 : 1.5;
	const windowX = windowPosition.x * -1 * zoom;
	const windowY = windowPosition.y * -1 * zoom;

	if (!showGrid) {
		return null;
	}

	return (
		<div
			style={
				{
					'--grid-size': baseGridSize * zoom + 'px',
					'--dot-size': `${dotSize * zoom}px`,
					backgroundPosition: `${windowX + baseBackgroundPosition}px ${windowY + baseBackgroundPosition}px`,
				} as React.CSSProperties
			}
			className="dots absolute inset-0"
		/>
	);
}
