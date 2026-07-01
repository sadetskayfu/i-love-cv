import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from 'tailwind-variants';
import { Backdrop } from '@/shared/ui/backdrop';

export function DialogPopup(props: DialogPopup.Props) {
	const { children, className, backdrop, portalTarget, ...otherProps } = props;

	return (
		<BaseDialog.Portal container={portalTarget} onWheel={event => event.stopPropagation()}>
			{backdrop && <BaseDialog.Backdrop render={<Backdrop />} />}
			<BaseDialog.Popup
				className={cn(
					`fixed top-1/2 left-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_0.5rem] shadow-black/90 outline-hidden transition-[scale,opacity] duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0`,
					className
				)}
				{...otherProps}
			>
				{children}
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	);
}

export namespace DialogPopup {
	export type Props = BaseDialog.Popup.Props & {
		backdrop?: boolean;
		portalTarget?: BaseDialog.Portal.Props['container'];
	};
}
