import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { ListItem } from '@/shared/ui/list-items';

export const ContextMenuItem = React.forwardRef(function MenuItem(
	props: ContextMenuItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	const { render, ...otherProps } = props;

	return (
		<BaseContextMenu.Item
			ref={forwardedRef}
			render={<ListItem render={render} />}
			{...otherProps}
		/>
	);
});

export namespace ContextMenuItem {
	export type Props = Omit<BaseContextMenu.Item.Props, 'render'> &
		Pick<ListItem.Props, 'render'> & {};
}
