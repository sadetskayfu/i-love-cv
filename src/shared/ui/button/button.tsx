import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react';
import { cn, tv } from 'tailwind-variants';
import { ButtonContext, useButtonContext } from './provider/button-context';

export const Button = React.forwardRef(function Button(
	props: Button.Props,
	forwardedRef: React.ForwardedRef<HTMLButtonElement>
) {
	const { className, children, variant, color, size, radius, iconButton, disabled, ...otherProps } =
		props;

	const context = useButtonContext();

	const finalVariants: Omit<ButtonContext, 'className'> = {
		variant: variant ?? context?.variant ?? 'ghost',
		color: color ?? context?.color ?? 'accent',
		size: size ?? context?.size ?? '3',
		radius: radius ?? context?.radius ?? undefined,
		disabled: disabled ?? context?.disabled ?? false,
		iconButton: iconButton ?? context?.iconButton ?? false,
	};

	return (
		<BaseButton
			ref={forwardedRef}
			className={cn(buttonVariants({ ...finalVariants }), context?.className, className)}
			disabled={finalVariants.disabled}
			{...otherProps}
		>
			{children}
		</BaseButton>
	);
});

export namespace Button {
	type Variant = 'filled' | 'ghost' | 'clear';
	type Color = 'accent' | 'secondary';
	type Size = '1' | '2' | '3' | '4';
	type Radius = '1' | '2' | '3' | 'circular' | 'none';

	export type Props = BaseButton.Props & {
		variant?: Variant;
		color?: Color;
		size?: Size;
		radius?: Radius;
		iconButton?: boolean;
	};
}

const buttonVariants = tv({
	base: `flex items-center justify-center 
        py-0 
        border-none 
        font-medium 
        select-none 
        data-disabled:opacity-35 data-disabled:cursor-not-allowed`,
	variants: {
		size: {
			'1': '',
			'2': 'h-8 px-3',
			'3': 'h-10 px-4',
			'4': 'h-14 px-5',
		},
		radius: {
			'1': 'rounded-sm',
			'2': 'rounded-md',
			'3': 'rounded-lg',
			circular: 'rounded-full',
			none: 'rounded-none',
		},
		color: {
			accent: '',
			secondary: '',
		},
		variant: {
			filled: '',
			ghost: '',
			clear: '',
		},
		iconButton: {
			true: 'aspect-square p-0',
		},
	},
	compoundVariants: [
		{
			variant: 'filled',
			color: 'accent',
			class: `
                text-gray-50 bg-green-500 
                hover:not-data-disabled:bg-green-700 
                active:not-data-disabled:bg-green-800`,
		},
		{
			variant: 'ghost',
			color: 'accent',
			class: `
                text-green-600 bg-green-500/15 
                hover:not-data-disabled:bg-green-500/25 
                active:not-data-disabled:bg-green-500/15`,
		},
		{
			variant: 'ghost',
			color: 'secondary',
			class: `
                text-neutral-950 bg-gray-900/5 
                hover:not-data-disabled:bg-gray-900/10
                active:not-data-disabled:bg-gray-900/5`,
		},
		{
			variant: 'clear',
			color: 'secondary',
			class: `
            text-neutral-950 bg-transparent 
            hover:not-data-disabled:bg-gray-900/5 
            active:not-data-disabled:bg-gray-900/10`,
		},
	],
});
