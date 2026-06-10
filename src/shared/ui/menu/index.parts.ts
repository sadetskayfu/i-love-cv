import { Menu as BaseMenu } from '@base-ui/react/menu';

export { MenuPopup as Popup } from './menu-popup';
export { MenuItem as Item } from './menu-item';

export const Root = BaseMenu.Root;
export const Trigger = BaseMenu.Trigger;

export namespace Root {
	export type Props = BaseMenu.Root.Props;
}
