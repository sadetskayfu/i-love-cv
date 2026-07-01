import * as React from 'react';
import { cn } from 'tailwind-variants';
import { Icon } from '../icons';
import { ListItem } from './list-item';

export const CheckboxListItem = React.forwardRef(function CheckboxListItem(
	props: CheckboxListItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	const { children, className, ...otherProps } = props;

	return (
		<ListItem ref={forwardedRef} className={cn('group', className)} {...otherProps}>
			{children}
			<Icon.Check
				className={
					// prettier-ignore
					`text-green-600 
					opacity-0 transition-opacity
					group-data-checked:opacity-100`
				}
			/>
		</ListItem>
	);
});

export namespace CheckboxListItem {
	export type Props = ListItem.Props;
}
