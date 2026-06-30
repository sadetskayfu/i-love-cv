import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { CheckboxListItem } from '@/shared/ui/list-items';

export const ContextMenuCheckboxItem = React.forwardRef(function MenuCheckboxItem(
	props: ContextMenuCheckboxItem.Props,
	forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
	return <BaseContextMenu.CheckboxItem ref={forwardedRef} render={<CheckboxListItem />} {...props} />;
});

export namespace ContextMenuCheckboxItem {
	export type Props = BaseContextMenu.CheckboxItem.Props;
}
