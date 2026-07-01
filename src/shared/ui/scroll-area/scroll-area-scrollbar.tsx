import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from 'tailwind-variants';

export function ScrollAreaScrollbar({
	allwaysVisible,
	...otherProps
}: BaseScrollArea.Scrollbar.Props & { allwaysVisible?: boolean }) {
	return (
		<BaseScrollArea.Scrollbar
			className={cn(
				'bg-black/12 data-[orientation=horizontal]:h-4 data-[orientation=vertical]:w-4',
				{
					'opacity-0 transition-opacity data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-0':
						!allwaysVisible,
				}
			)}
			{...otherProps}
		>
			<BaseScrollArea.Thumb className="data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full bg-neutral-500" />
		</BaseScrollArea.Scrollbar>
	);
}
