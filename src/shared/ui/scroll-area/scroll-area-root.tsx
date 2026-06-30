import { cn } from 'tailwind-variants';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';

export function ScrollAreaRoot({ className, ...otherProps }: BaseScrollArea.Root.Props) {
	return (
		<BaseScrollArea.Root
			className={cn(
				`has-[>_:first-child:focus-visible]:outline-2 
                has-[>_:first-child:focus-visible]:-outline-offset-1 
                has-[>_:first-child:focus-visible]:outline-green-600`,
				className
			)}
			{...otherProps}
		/>
	);
}
