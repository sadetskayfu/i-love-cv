export function Backdrop(props: React.ComponentProps<'div'>) {
	return (
		<div
			className="fixed inset-0 min-h-dvh bg-black opacity-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
			{...props}
		/>
	);
}
