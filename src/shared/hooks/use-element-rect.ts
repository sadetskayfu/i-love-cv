import * as React from 'react';

export type ElementRect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function useElementRect() {
	const [elementRect, setElementRect] = React.useState<ElementRect | null>(null);

	const elementRef: React.RefCallback<HTMLDivElement> = React.useCallback(el => {
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				const { x, y } = entry.target.getBoundingClientRect();

				setElementRect(prev => {
					if (
						prev &&
						prev.x === x &&
						prev.y === y &&
						prev.width === width &&
						prev.height === height
					) {
						return prev;
					} else {
						return { x, y, width, height };
					}
				});
			}
		});

		if (el) {
			observer.observe(el);

			return () => {
				observer.disconnect();
			};
		}
	}, []);

	return {
		elementRect,
		elementRef,
	};
}
