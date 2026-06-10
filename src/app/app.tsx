import { Header } from '@/widgets/header';
import { useInitTemplates } from '@/features/templates';
import './styles/index.css';
import { Board } from '@/features/board';

export function App() {
	useInitTemplates()

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<Board />
		</div>
	);
}
