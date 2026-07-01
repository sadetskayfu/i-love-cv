import * as React from 'react';
import { useElementFocus } from '@/shared/hooks/use-element-focus';
import { useElementRect } from '@/shared/hooks/use-element-rect';
import { BoardContext } from './board-context';
import { Canvas } from './canvas';
import { Dots } from './dots';
import { Layout } from './layout';
import { Moveable } from './moveable';
import { NodeList } from './node-list';
import { NodeBorder } from './nodes/node-border';
import { CreationRect, SelectionRect } from './rects';
import { CustomizationToolbar } from './toolbars/customization-toolbar';
import { HistoryToolbar } from './toolbars/history-toolbar';
import { MainToolbar } from './toolbars/main-toolbar';
import { ZoomControlPanel } from './toolbars/zoom-control-panel';

export function Board() {
	const { elementRef: canvasRef, elementRect: canvasRect } = useElementRect();
	const { elementRef: rootRef } = useElementFocus<HTMLDivElement>(true);
	const customizationToolbarPortalTargetRef = React.useRef<HTMLDivElement>(null);

	const contextValue: BoardContext = React.useMemo(
		() => ({ rootRef, customizationToolbarPortalTargetRef, canvasRect }),
		[canvasRect]
	);

	return (
		<Layout ref={rootRef}>
			<BoardContext.Provider value={contextValue}>
				<Dots />
				<Canvas ref={canvasRef}>
					<NodeList />
					<NodeBorder />
					<Moveable />
				</Canvas>
				<SelectionRect />
				<CreationRect />

				<div className="fixed top-12 left-2 flex flex-col gap-y-2">
					<MainToolbar />
					<HistoryToolbar />
				</div>
				<ZoomControlPanel />
				<CustomizationToolbar />
			</BoardContext.Provider>
		</Layout>
	);
}
