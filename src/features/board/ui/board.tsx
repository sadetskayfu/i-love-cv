import * as React from 'react';
import { Canvas } from './canvas';
import { Dots } from './dots';
import { Layout } from './layout';
import { Moveable } from './moveable';
import { NodeList } from './node-list';
import { Rect } from './rect';
import { useElementRect } from '@/shared/hooks/use-element-rect';
import { BoardContext } from './board-context';
import { useElementFocus } from '@/shared/hooks/use-element-focus';
import { HistoryToolbar } from './toolbars/history-toolbar';
import { ZoomControlPanel } from './toolbars/zoom-control-panel';
import { MainToolbar } from './toolbars/main-toolbar';
import { NodeBorder } from './nodes/node-border';
import { useAtom } from 'jotai';
import { boardState } from '../model';
//import { Moveable } from './deepseek/moveable';

export function Board() {
	const { elementRef: canvasRef, elementRect: canvasRect } = useElementRect();
	const { elementRef: rootRef } = useElementFocus<HTMLDivElement>(true);

	const contextValue: BoardContext = React.useMemo(
		() => ({ rootRef, canvasRect }),
		[canvasRect]
	);

	const [selectedNodeIdsAtom] = useAtom(boardState.selectedNodeIdsAtom)
	console.log(selectedNodeIdsAtom)

	return (
		<Layout ref={rootRef}>
			<BoardContext.Provider value={contextValue}>
				<Dots />
				
				<Canvas ref={canvasRef}>
					
					<NodeList />
					<NodeBorder />
					<Moveable />
				</Canvas>
				<Rect />

				<div className="fixed top-12 left-2 flex flex-col gap-y-2">
					<MainToolbar />
					<HistoryToolbar />
				</div>
				<ZoomControlPanel />
			</BoardContext.Provider>
		</Layout>
	);
}
