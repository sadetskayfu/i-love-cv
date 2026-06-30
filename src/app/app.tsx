import { Header } from '@/widgets/header';
import { useInitTemplates } from '@/features/templates';
import { Board, boardState } from '@/features/board';
import { useAtom } from 'jotai';
import { cn } from 'tailwind-variants';
import './styles/index.css';

export function App() {
	const [isRect] = useAtom(boardState.isRectAtom);

	useInitTemplates();

	return (
		<div className={cn("flex min-h-screen flex-col", {'select-none': isRect})}>
			<Header />
			<Board />
		</div>
	);
}
