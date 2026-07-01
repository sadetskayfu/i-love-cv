import * as React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cn } from 'tailwind-variants';
import { boardStore } from '../../model/board';
import { nodeSelectionStore } from '../../model/node-selection';
import type { Position } from '../../model/types';

export function BaseNode(props: BaseNode.Props) {
	const {
		children,
		ref,
		className,
		style,
		id,
		position,
		rotate,
		onClick,
		onPointerUp,
		onPointerDown,
		...otherProps
	} = props;

	const isOnlyOneSelected = useAtomValue(nodeSelectionStore.isOnlyOneSelected(id));
	const isSelectionMode = useAtomValue(boardStore.isSelectionMode);

	const selectNodes = useSetAtom(nodeSelectionStore.selectNodes);

	return (
		<div
			ref={ref}
			data-id={id}
			className={cn(
				'absolute leading-none bg-green-50',
				{ 'pointer-events-none': !isSelectionMode },
				className
			)}
			style={{
				transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
				zIndex: isOnlyOneSelected ? 1 : undefined,
				...style,
			}}
			onPointerDown={event => {
				if (event.button === 0 && isSelectionMode) {
					if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
						selectNodes([id], 'replace');
					}
				}

				onPointerDown?.(event);
			}}
			onPointerUp={event => {
				if (event.button === 0 && isSelectionMode) {
					if (event.ctrlKey || event.metaKey || event.shiftKey) {
						selectNodes([id], 'toggle');
					}
				}

				onPointerUp?.(event);
			}}
			{...otherProps}
		>
			{children}
		</div>
	);
}

export namespace BaseNode {
	export type Props = React.ComponentProps<'div'> & {
		id: string;
		position: Position;
		rotate: number;
	};
}
