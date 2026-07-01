import { useAtom } from 'jotai';
import { cn } from 'tailwind-variants';
import { Board, nodeManagerStore, nodeSelectionStore } from '@/features/board';
import { useInitTemplates } from '@/features/templates';
import { Header } from '@/widgets/header';
import './styles/index.css';

export function App() {
	const [isCreationRect] = useAtom(nodeManagerStore.isCreationRectAtom);
	const [isSelectionRect] = useAtom(nodeSelectionStore.isSelectionRectAtom)

	useInitTemplates();

	return (
		<div className={cn('flex min-h-screen flex-col', { 'select-none': isCreationRect || isSelectionRect })}>
			<Header />
			<Board />
		</div>
	);
}
