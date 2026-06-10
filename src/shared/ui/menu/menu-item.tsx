import * as React from 'react';
import { cn } from 'tailwind-variants';
import { Menu as BaseMenu } from '@base-ui/react/menu';

export const MenuItem = React.forwardRef(function MenuItem(
	props: MenuItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	const { className, ...otherProps } = props;

	return (
		<BaseMenu.Item
			ref={forwardedRef}
			className={cn(
				`flex items-center justify-between gap-x-3 px-2 py-1 outline-hidden select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 not-data-disabled:data-highlighted:bg-neutral-950 not-data-disabled:data-highlighted:text-white`,
				className
			)}
			{...otherProps}
		/>
	);
});

export namespace MenuItem {
	export type Props = BaseMenu.Item.Props & {};
}
