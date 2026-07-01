import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from 'tailwind-variants';
import { Backdrop } from '@/shared/ui/backdrop';
import {
	POPUP_ARROW_PADDING,
	POPUP_COLLISION_PADDING_BLOCK,
	POPUP_COLLISION_PADDING_INLINE,
	POPUP_SIDE_OFFSET,
	POPUP_SIDE_OFFSET_WITH_ARROW,
} from '@/shared/ui/constants';
import { PopupArrow } from '@/shared/ui/popup-arrow';

export function PopoverPopup(props: PopoverPopup.Props) {
	const {
		children,
		className,
		backdrop,
		arrow,
		side,
		align,
		sideOffset,
		anchor,
		anchorWidth,
		minAnchorWidth,
		portalTarget,
		...otherProps
	} = props;

	return (
		<BasePopover.Portal container={portalTarget}>
			{backdrop && <BasePopover.Backdrop render={<Backdrop />} />}
			<BasePopover.Positioner
				collisionPadding={{
					left: POPUP_COLLISION_PADDING_INLINE,
					right: POPUP_COLLISION_PADDING_INLINE,
					top: POPUP_COLLISION_PADDING_BLOCK,
					bottom: POPUP_COLLISION_PADDING_BLOCK,
				}}
				arrowPadding={POPUP_ARROW_PADDING}
				sideOffset={sideOffset ?? (arrow ? POPUP_SIDE_OFFSET_WITH_ARROW : POPUP_SIDE_OFFSET)}
				side={side}
				align={align}
				anchor={anchor}
			>
				<BasePopover.Popup
					className={cn(
						`origin-(--transform-origin) rounded-md bg-white shadow-[0_0_0.5rem] shadow-black/90 outline-hidden transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-90 data-starting-style:opacity-0`,
						{ 'w-(--anchor-width)': anchorWidth },
						{ 'min-w-(--anchor-width)': minAnchorWidth },
						className
					)}
					{...otherProps}
				>
					{arrow && <BasePopover.Arrow render={<PopupArrow />} />}
					{children}
				</BasePopover.Popup>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	);
}

export namespace PopoverPopup {
	export type Props = BasePopover.Popup.Props &
		Pick<BasePopover.Positioner.Props, 'side' | 'align' | 'anchor' | 'sideOffset'> & {
			backdrop?: boolean;
			arrow?: boolean;
			anchorWidth?: boolean;
			minAnchorWidth?: boolean;
			portalTarget?: BasePopover.Portal.Props['container'];
		};
}
