import { Popover as BasePopover } from '@base-ui/react/popover';

export { PopoverPopup as Popup } from './popover-popup';

export const Root = BasePopover.Root;
export const Trigger = BasePopover.Trigger;
export const Close = BasePopover.Close;
export const Title = BasePopover.Title;
export const Description = BasePopover.Description;
export const Viewport = BasePopover.Viewport;
export const createHandle = BasePopover.createHandle;

export namespace Root {
	export type Props = BasePopover.Root.Props;
}
