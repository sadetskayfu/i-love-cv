import { useHotkeys } from '../model/hotkeys';

export function Layout({ children, ref, ...otherProps }: React.ComponentProps<'div'>) {
	const { handleHotkeys } = useHotkeys();

	return (
		<div
			className="relative grow bg-gray-100 outline-none"
			ref={ref}
			tabIndex={0}
			onKeyDown={handleHotkeys}
			onContextMenu={event => event.preventDefault()}
			{...otherProps}
		>
			{children}
		</div>
	);
}
