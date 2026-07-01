import { Dialog } from '@base-ui/react';
import { cn } from 'tailwind-variants';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';

export function DialogHeader({ children, className }: DialogHeader.Props) {
	return (
		<div
			className={cn(
				'flex items-center justify-between gap-x-2 border-b border-neutral-500 py-1 pr-1 pl-3',
				className
			)}
		>
			<Dialog.Title className="font-bold" render={children} />
			<Dialog.Close
				aria-label="Close"
				render={<Button size="2" variant="clear" color="secondary" iconButton />}
			>
				<Icon.X />
			</Dialog.Close>
		</div>
	);
}

export namespace DialogHeader {
	export type Props = {
		children: React.ReactElement;
		className?: string;
	};
}
