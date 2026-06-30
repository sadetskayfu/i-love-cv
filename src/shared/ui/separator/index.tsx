import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from 'tailwind-variants';

export function Separator({ className, ...otherProps }: Separator.Props) {
	return (
		<BaseSeparator
			className={cn(
				`rounded-full bg-neutral-300 data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px`,
				className
			)}
			{...otherProps}
		/>
	);
}

export namespace Separator {
	export type Props = BaseSeparator.Props;
}
