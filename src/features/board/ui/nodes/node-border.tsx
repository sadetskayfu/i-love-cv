import { useAtom } from 'jotai';
import { nodeSelectionStore } from '../../model/node-selection';
import { windowStore } from '../../model/window';

export function NodeBorder() {
	const [candidateNodes] = useAtom(nodeSelectionStore.candidateDomNodes);
	const [zoom] = useAtom(windowStore.zoomAtom);

	return (
		<div aria-hidden>
			{candidateNodes.map(node => (
				<div
					key={node.dataset['id']}
					className="absolute pointer-events-none outline outline-green-600"
					style={{
						width: node.style.width,
						height: node.style.height,
						left: 0,
						top: 0,
						transform: node.style.transform,
						outlineWidth: `${1 / zoom}px`,
					}}
				/>
			))}
		</div>
	);
}
