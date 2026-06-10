import * as React from 'react';
import { cn, tv } from 'tailwind-variants';
import { Input as BaseInput } from '@base-ui/react/input';

export const Input = React.forwardRef(function Input(
	{ className, size = '3', ...otherProps }: Input.Props,
	forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
	return (
		<BaseInput
			className={cn(inputVariants({ size }), className)}
			{...otherProps}
			ref={forwardedRef}
		/>
	);
});

export namespace Input {
	type Size = '2' | '3';

	export type Props = Omit<BaseInput.Props, 'size'> & {
		size?: Size;
	};
}

const inputVariants = tv({
	base: `border border-neutral-950
        text-ellipsis text-neutral-950 placeholder-neutral-500
        data-disabled:opacity-35 data-disabled:cursor-not-allowed
        focus:outline-2 focus:-outline-offset-1 focus:outline-green-600`,
	variants: {
		size: {
			'2': 'h-8 px-2',
			'3': 'h-10 px-3',
		},
	},
});
