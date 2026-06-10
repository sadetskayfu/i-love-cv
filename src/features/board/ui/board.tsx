import * as React from 'react';
import { Canvas } from './canvas';
import { Dots } from './dots';
import { Layout } from './layout';
import { Moveable } from './moveable';
import { NodeList } from './node-list';
import { SelectionRect } from './selection-rect';
import { useElementRect } from '@/shared/hooks/use-element-rect';
import { BoardContext } from './board-context';
import { useElementFocus } from '@/shared/hooks/use-element-focus';
import { HistoryToolbar } from './toolbars/history-toolbar';
import { ZoomControlPanel } from './toolbars/zoom-control-panel';
import { MainToolbar } from './toolbars/main-toolbar';

export function Board() {
	const { elementRef: canvasRef, elementRect: canvasRect } = useElementRect();
	const { elementRef: rootRef } = useElementFocus<HTMLDivElement>(true);

	const contextValue: BoardContext = React.useMemo(() => ({ canvasRect, rootRef }), [canvasRect]);

	return (
		<Layout ref={rootRef}>
			<BoardContext.Provider value={contextValue}>
				<Dots />
				<Canvas ref={canvasRef}>
					<NodeList />
					<Moveable />
				</Canvas>
				<SelectionRect />

				<div className="fixed top-12 left-2 flex flex-col gap-y-2">
					<MainToolbar />
					<HistoryToolbar />
				</div>
				<ZoomControlPanel />
			</BoardContext.Provider>
		</Layout>
	);
}
