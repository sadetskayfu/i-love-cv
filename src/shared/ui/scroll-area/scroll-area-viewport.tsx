import { cn } from 'tailwind-variants';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';

export function ScrollAreaViewport({
	overflowShadow,
	...otherProps
}: BaseScrollArea.Viewport.Props & { overflowShadow?: boolean }) {
	return (
		<BaseScrollArea.Viewport
			className={cn('h-full', {
				'mask-linear-[to_bottom,transparent_0,black_min(40px,var(--scroll-area-overflow-y-start)),black_calc(100%_-_min(40px,var(--scroll-area-overflow-y-end,40px))),transparent_100%] mask-no-repeat':
					overflowShadow,
			})}
			{...otherProps}
		/>
	);
}
