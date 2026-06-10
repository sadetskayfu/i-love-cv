import { Dialog as BaseDialog } from '@base-ui/react/dialog';

export { DialogPopup as Popup } from './dialog-popup';
export { DialogHeader as Header } from './dialog-header';

export const Root = BaseDialog.Root;
export const Trigger = BaseDialog.Trigger;
export const Close = BaseDialog.Close;
export const Title = BaseDialog.Title;
export const Description = BaseDialog.Description;
export const Viewport = BaseDialog.Viewport;

export namespace Root {
	export type Props = BaseDialog.Root.Props;
}
