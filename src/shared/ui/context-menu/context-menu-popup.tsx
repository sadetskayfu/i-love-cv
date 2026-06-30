import { cn } from 'tailwind-variants';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';

export function ContextMenuPopup(props: ContextMenuPopup.Props) {
	const { children, className, portalTarget, anchor, ...otherProps } = props;

	return (
		<BaseContextMenu.Portal container={portalTarget}>
			<BaseContextMenu.Positioner anchor={anchor}>
				<BaseContextMenu.Popup
					className={cn(
						// prettier-ignore
						`bg-white border border-neutral-300 rounded-md
                        transition-[scale,opacity] duration-100 ease-out 
                        data-ending-style:scale-[0.98] data-ending-style:opacity-0 
                        data-starting-style:scale-[0.98] data-starting-style:opacity-0
                        outline-hidden
                        origin-(--transform-origin)`,
						className
					)}
					{...otherProps}
				>
					{children}
				</BaseContextMenu.Popup>
			</BaseContextMenu.Positioner>
		</BaseContextMenu.Portal>
	);
}

export namespace ContextMenuPopup {
	export type Props = BaseContextMenu.Popup.Props & Pick<BaseContextMenu.Positioner.Props, 'anchor'> & {
		portalTarget?: BaseContextMenu.Portal.Props['container'];
	};
}
