import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { ListItem } from '@/shared/ui/list-items';

export const MenuItem = React.forwardRef(function MenuItem(
	props: MenuItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	const { render, ...otherProps } = props;

	return <BaseMenu.Item ref={forwardedRef} render={<ListItem render={render} />} {...otherProps} />;
});

export namespace MenuItem {
	export type Props = Omit<BaseMenu.Item.Props, 'render'> & Pick<ListItem.Props, 'render'> & {};
}
