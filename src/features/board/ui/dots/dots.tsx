import * as React from 'react';
import { useAtom } from 'jotai';
import { boardState } from '../../model';
import './dots.css';

export function Dots() {
	const [windowPosition] = useAtom(boardState.windowPositionAtom);

	const baseGridSize =
		windowPosition.zoom <= 0.4 ? 20 / 0.4 : windowPosition.zoom <= 0.6 ? 20 / 0.6 : 20;
	const dotSize = Math.max(1.5, windowPosition.zoom * 1.5);

	return (
		<div
			style={
				{
					'--window-x': -windowPosition.x * windowPosition.zoom + 'px',
					'--window-y': -windowPosition.y * windowPosition.zoom + 'px',
					'--grid-size': baseGridSize * windowPosition.zoom + 'px',
					'--dot-size': dotSize + 'px',
				} as React.CSSProperties
			}
			className="dots absolute inset-0"
		/>
	);
}
