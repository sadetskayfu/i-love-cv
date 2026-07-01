import { Menu as BaseMenu } from '@base-ui/react/menu';
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

export function MenuPopup(props: MenuPopup.Props) {
	const {
		children,
		className,
		backdrop,
		arrow,
		side,
		align,
		anchor,
		anchorWidth,
		minAnchorWidth,
		portalTarget,
		...otherProps
	} = props;

	return (
		<BaseMenu.Portal container={portalTarget}>
			{backdrop && <BaseMenu.Backdrop render={<Backdrop />} />}
			<BaseMenu.Positioner
				collisionPadding={{
					left: POPUP_COLLISION_PADDING_INLINE,
					right: POPUP_COLLISION_PADDING_INLINE,
					top: POPUP_COLLISION_PADDING_BLOCK,
					bottom: POPUP_COLLISION_PADDING_BLOCK,
				}}
				arrowPadding={POPUP_ARROW_PADDING}
				sideOffset={arrow ? POPUP_SIDE_OFFSET_WITH_ARROW : POPUP_SIDE_OFFSET}
				side={side}
				align={align}
				anchor={anchor}
			>
				<BaseMenu.Popup
					className={cn(
						// prettier-ignore
						`bg-white shadow-[0_0_0.5rem] shadow-black/90 p-1
						origin-(--transform-origin) outline-hidden 
						transition-[transform,scale,opacity] 
						data-ending-style:scale-90 data-ending-style:opacity-0 
						data-starting-style:scale-90 data-starting-style:opacity-0
						data-instant:transition-none`,
						{ 'w-(--anchor-width)': anchorWidth },
						{ 'min-w-(--anchor-width)': minAnchorWidth },
						className
					)}
					{...otherProps}
				>
					{arrow && <BaseMenu.Arrow render={<PopupArrow />} />}
					{children}
				</BaseMenu.Popup>
			</BaseMenu.Positioner>
		</BaseMenu.Portal>
	);
}

export namespace MenuPopup {
	export type Props = BaseMenu.Popup.Props &
		Pick<BaseMenu.Positioner.Props, 'side' | 'align' | 'anchor'> & {
			backdrop?: boolean;
			arrow?: boolean;
			anchorWidth?: boolean;
			minAnchorWidth?: boolean;
			portalTarget?: BaseMenu.Portal.Props['container'];
		};
}
