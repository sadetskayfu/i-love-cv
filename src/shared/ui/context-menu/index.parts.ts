import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';

export { ContextMenuPopup as Popup } from './context-menu-popup';
export { ContextMenuItem as Item } from './context-menu-item';
export { ContextMenuCheckboxItem as CheckboxItem } from './context-menu-checkbox-item';

export const Root = BaseContextMenu.Root;
export const Trigger = BaseContextMenu.Trigger;
export const Group = BaseContextMenu.Group;
export const GroupLabel = BaseContextMenu.GroupLabel;

export namespace Root {
	export type Props = BaseContextMenu.Root.Props;
}
