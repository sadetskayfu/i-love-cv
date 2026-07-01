import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react';
import { cn } from 'tailwind-variants';
import {
	POPUP_ARROW_PADDING,
	POPUP_COLLISION_PADDING_BLOCK,
	POPUP_COLLISION_PADDING_INLINE,
	POPUP_SIDE_OFFSET,
	POPUP_SIDE_OFFSET_WITH_ARROW,
} from '@/shared/ui/constants';
import { PopupArrow } from '@/shared/ui/popup-arrow';

export function Tooltip(props: Tooltip.Props) {
	const {
		children,
		content,
		className: className,
		side,
		align,
		portalTarget,
		arrow = true,
		delay = 100,
		closeDelay = 0,
		anchorWidth,
		minAnchorWidth,
	} = props;

	return (
		<BaseTooltip.Root>
			<BaseTooltip.Trigger render={children} delay={delay} closeDelay={closeDelay} />
			<BaseTooltip.Portal container={portalTarget}>
				<BaseTooltip.Positioner
					side={side}
					align={align}
					collisionPadding={{
						left: POPUP_COLLISION_PADDING_INLINE,
						right: POPUP_COLLISION_PADDING_INLINE,
						top: POPUP_COLLISION_PADDING_BLOCK,
						bottom: POPUP_COLLISION_PADDING_BLOCK,
					}}
					arrowPadding={POPUP_ARROW_PADDING}
					sideOffset={arrow ? POPUP_SIDE_OFFSET_WITH_ARROW : POPUP_SIDE_OFFSET}
				>
					<BaseTooltip.Popup
						className={cn(
							`origin-(--transform-origin) rounded-sm bg-gray-900 px-2 py-1 text-white transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-90 data-starting-style:opacity-0`,
							{ 'w-(--anchor-width)': anchorWidth },
							{ 'min-w-(--anchor-width)': minAnchorWidth },
							className
						)}
					>
						{arrow && <BaseTooltip.Arrow render={<PopupArrow />} />}
						{content}
					</BaseTooltip.Popup>
				</BaseTooltip.Positioner>
			</BaseTooltip.Portal>
		</BaseTooltip.Root>
	);
}

export namespace Tooltip {
	export type Props = BaseTooltip.Root.Props &
		Pick<BaseTooltip.Positioner.Props, 'side' | 'align'> & {
			children: React.ReactElement<Record<string, unknown>>;
			content: React.ReactNode;
			className?: string;
			portalTarget?: BaseTooltip.Portal.Props['container'];
			arrow?: boolean;
			delay?: number;
			closeDelay?: number;
			anchorWidth?: boolean;
			minAnchorWidth?: boolean;
		};
}
