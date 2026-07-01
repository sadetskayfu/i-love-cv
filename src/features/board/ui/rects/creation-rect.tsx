import { useAtom } from 'jotai';
import { nodeManagerStore } from '../../model/node-manager';
import { Rect } from './rect';

export function CreationRect() {
	const [rect] = useAtom(nodeManagerStore.creationRectAtom);
	const [isRect] = useAtom(nodeManagerStore.isCreationRectAtom);

	if (!rect || !isRect) {
		return null;
	}

	return <Rect rect={rect} />;
}
