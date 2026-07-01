import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ContextMenu } from '@/shared/ui/context-menu';
import { Separator } from '@/shared/ui/separator';
import { boardStore } from '../model/board';
import { windowStore } from '../model/window';
import { nodeManagerStore } from '../model/node-manager';

export function BoardContextMenu({
	children,
	...otherProps
}: ContextMenu.Root.Props & { children: React.ReactElement<HTMLDivElement> }) {
	const [open, setOpen] = React.useState<boolean>(false);
	const [showGrid, setShowGrid] = useAtom(boardStore.showGrid);
	const [snapToGrid, setSnapToGrid] = useAtom(boardStore.snapToGrid);
	const [snapToObject, setSnapToObject] = useAtom(boardStore.snapToObject);
	const [hasWindowDragging] = useAtom(windowStore.hasWindowDraggingAtom);
	const pasteNodes = useSetAtom(nodeManagerStore.pasteNodes);

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
