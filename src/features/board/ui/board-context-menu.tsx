import * as React from 'react';
import { ContextMenu } from '@/shared/ui/context-menu';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardState } from '../model';
import { Separator } from '@/shared/ui/separator';

export function BoardContextMenu({
	children,
	...otherProps
}: ContextMenu.Root.Props & { children: React.ReactElement<HTMLDivElement> }) {
	const [open, setOpen] = React.useState<boolean>(false);

	const [showGrid, setShowGrid] = useAtom(boardState.showGrid);
	const [snapToGrid, setSnapToGrid] = useAtom(boardState.snapToGrid);
	const [snapToObject, setSnapToObject] = useAtom(boardState.snapToObject);

	const [hasWindowDragging] = useAtom(boardState.hasWindowDraggingAtom);
	const pasteNodes = useSetAtom(boardActions.pasteNodes);

	return (
		<ContextMenu.Root
			open={open}
			onOpenChange={open => {
				setOpen(() => {
					if (open) {
						return hasWindowDragging ? false : true;
					}
					return false;
				});
			}}
			{...otherProps}
		>
			<ContextMenu.Trigger render={children} />
			<ContextMenu.Popup
				className="w-60 overflow-hidden py-1"
				onPointerDown={event => event.stopPropagation()}
			>
				<ContextMenu.Item onClick={pasteNodes} nativeButton render={<button />}>
					Paste <span className="text-neutral-500">Ctrl + V</span>
				</ContextMenu.Item>
				<Separator className="my-1" />
				<ContextMenu.Group>
					<ContextMenu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
						Show grid
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem checked={snapToGrid} onCheckedChange={setSnapToGrid}>
						Snap to grid
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem checked={snapToObject} onCheckedChange={setSnapToObject}>
						Snap to object
					</ContextMenu.CheckboxItem>
				</ContextMenu.Group>
			</ContextMenu.Popup>
		</ContextMenu.Root>
	);
}
