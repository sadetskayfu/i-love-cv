//import { useAtom } from 'jotai';
import { useBoardContext } from '../../board-context';
//import { nodeSelectionStore } from '@/features/board/model/node-selection';

export function CustomizationToolbar() {
	//const [isVisible] = useAtom(nodeSelectionStore.hasSelectedNodes);

	const { customizationToolbarPortalTargetRef } = useBoardContext();

	return (
		<div className="absolute top-0 bg-white p-1">
			<div></div>
			<div ref={customizationToolbarPortalTargetRef}>{/* Slot for editable toolbar */}</div>
		</div>
	);
}
