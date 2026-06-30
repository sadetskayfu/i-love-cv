import * as React from 'react';
import { cn } from 'tailwind-variants';

export const ColorButton = React.forwardRef(function ColorButton(
	props: ColorButton.Props,
	forwardedRef: React.ForwardedRef<HTMLButtonElement>
) {
	const { className, active, color, ...otherProps } = props;

	return (
		<button
			ref={forwardedRef}
			aria-pressed={active ? 'true' : 'false'}
			style={{ backgroundColor: color }}
			className={cn(
				'group relative flex h-8 w-8 items-center justify-center rounded-full border border-neutral-600 bg-white outline-none',
				className
			)}
			{...otherProps}
		>
			{!color && !active && (
				<div className="absolute h-px w-full -rotate-45 bg-neutral-600 group-hover:bg-transparent group-focus-visible:bg-transparent group-data-active:bg-transparent" />
			)}
			<svg
				aria-hidden
				className={cn(
					'h-6 w-6 opacity-0 group-hover:opacity-30 group-focus-visible:opacity-30 group-data-active:opacity-100',
					{
						'rounded-full bg-white': !color,
					}
				)}
				viewBox="0 0 24 24"
			>
				<polyline
					points="4 12 9 17 20 6"
					fill="none"
					stroke="white"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<polyline
					points="4 12 9 17 20 6"
					fill="none"
					stroke="black"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	);
});

export namespace ColorButton {
	export type Props = React.ComponentProps<'button'> & {
		color: string | undefined;
		active: boolean;
	};
}
