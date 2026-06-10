import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';

export function Layout({ children, ref, ...otherProps }: React.ComponentProps<'div'>) {
	const { handleKeyboardShortcuts } = useKeyboardShortcuts();

	return (
		<div
			className="relative grow bg-gray-100 outline-none"
			ref={ref}
			tabIndex={0}
			onKeyDown={handleKeyboardShortcuts}
			onContextMenu={event => event.preventDefault()}
			{...otherProps}
		>
			{children}
		</div>
	);
}
