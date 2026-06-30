import { useAtom } from 'jotai';
import { boardSelectors, boardState } from '../../model';

export function NodeBorder() {
	const [selectedNodes] = useAtom(boardSelectors.visualSelectedNodes);
    const [windowPosition] = useAtom(boardState.windowPositionAtom)

	return (
		<div aria-hidden>
			{selectedNodes.map(node => (
				<div
					key={node.dataset['id']}
					className="absolute pointer-events-none outline outline-green-600"
					style={{
						width: node.style.width,
						height: node.style.height,
						left: 0,
						top: 0,
                        transform: node.style.transform,
                        outlineWidth: `${1 / windowPosition.zoom}px`,
					}}
				/>
			))}
		</div>
	);
}
