import { Header } from '@/widgets/header';
import { useInitTemplates } from '@/features/templates';
import { Board, boardState } from '@/features/board';
import { useAtom } from 'jotai';
import './styles/index.css';
import { cn } from 'tailwind-variants';
import { Editable, EditableToolbar } from '@/shared/ui/editable';
import { useEffect } from 'react';

export function App() {
	const [isRect] = useAtom(boardState.isRectAtom);
	const [ids] = useAtom(boardState.selectedNodeIdsAtom)
	const [id] = useAtom(boardState.nodeIdInEditAtom)

	useEffect(() => {
		const intervalId = setInterval(() => {
			console.log(ids, id)
		}, 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [ids, id])

	useInitTemplates();

	return (
		<div className={cn("flex min-h-screen flex-col", {'select-none': isRect})}>
			<Header />
			<Board />
		</div>
	);
}
