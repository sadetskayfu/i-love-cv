import * as React from 'react';
import { mergeProps, useRender } from '@base-ui/react';
import { cn } from 'tailwind-variants';

export const ListItem = React.forwardRef(function ListItem(
	props: ListItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	const { render, className, ...otherProps } = props;

	const element = useRender({
		defaultTagName: 'div',
		render,
		ref: forwardedRef,
		props: mergeProps<'div'>(
			{
				className: cn(
					`flex items-center justify-between 
                    w-full gap-x-3 px-3 py-1 
                    outline-hidden select-none
                    data-disabled:cursor-not-allowed data-disabled:opacity-50 
                    not-data-disabled:data-highlighted:bg-green-500/15`,
					className
				),
			},
			otherProps
		),
	});

	return element;
});

export namespace ListItem {
	export type Props = useRender.ComponentProps<'div'> & {};
}
