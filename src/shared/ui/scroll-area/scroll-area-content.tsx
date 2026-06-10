import { cn } from 'tailwind-variants';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';

export function ScrollAreaContent({
	className,
	variablePadding,
	...otherProps
}: BaseScrollArea.Content.Props & { variablePadding?: boolean }) {
	return (
		<BaseScrollArea.Content
			className={cn(
				{ 'data-has-overflow-x:pb-5 data-has-overflow-y:pr-5': variablePadding },
				className
			)}
			{...otherProps}
		/>
	);
}
