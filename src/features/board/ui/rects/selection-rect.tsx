import { useAtom } from 'jotai';
import { nodeSelectionStore } from '../../model/node-selection';
import { Rect } from './rect';

export function SelectionRect() {
	const [rect] = useAtom(nodeSelectionStore.selectionRectAtom);
	const [isRect] = useAtom(nodeSelectionStore.isSelectionRectAtom);

	if (!rect || !isRect) {
		return null;
	}

	return <Rect rect={rect} />;
}
