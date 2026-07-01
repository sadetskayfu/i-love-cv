import * as React from 'react';
import { useSetAtom } from 'jotai';
import { cn } from 'tailwind-variants';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { Menu } from '@/shared/ui/menu';
import { templateStore } from '../../model';
import { RenameDialog } from './rename-dialog';

export const Item = React.memo(function TemplateItem(
	props: {
		name: string;
		id: string;
		active: boolean;
		disabledDelete: boolean;
		onSelect: () => void;
	} & React.ComponentProps<'div'>
) {
	const { className, name, id, active, disabledDelete, onSelect, ...otherProps } = props;

	const [openRenameDialog, setOpenRenameDialog] = React.useState<boolean>(false);

	const selectTemplate = useSetAtom(templateStore.selectTemplate);
	const deleteTemplate = useSetAtom(templateStore.deleteTemplateAtom);
	const renameTemplate = useSetAtom(templateStore.renameTemplate);

	function handleSelect() {
		if (active) {
			return;
		}

		selectTemplate(id);
		onSelect();
	}

	return (
		<div className="relative hover:bg-green-500/15">
			<div
				className={cn(
					`flex items-center gap-x-1 py-1 pr-9 pl-3 select-none focus:outline-none focus-visible:bg-green-500/15`,
					className
				)}
				tabIndex={0}
				onClick={handleSelect}
				onKeyDown={event => {
					if (event.key === 'Enter') {
						handleSelect();
					}
				}}
				{...otherProps}
			>
				<span className="truncate">{name}</span>
				{active && <span className="bg-green-500/50 px-1 text-xs">active</span>}
			</div>
			<Menu.Root modal={false}>
				<Menu.Trigger
					render={<Button size="2" variant="clear" iconButton />}
					className="absolute top-1/2 right-0 -translate-y-1/2 data-popup-open:bg-neutral-950! data-popup-open:text-white!"
					aria-label="Menu"
					openOnHover
					delay={0}
				>
					<Icon.EllipsisVertical />
				</Menu.Trigger>
				<Menu.Popup className="duration-0" side="left">
					<Menu.Item nativeButton render={<button />} onClick={() => setOpenRenameDialog(true)}>
						Change name <Icon.Edit />
					</Menu.Item>
					<Menu.Item
						nativeButton
						render={<button />}
						disabled={disabledDelete}
						onClick={() => deleteTemplate(id)}
					>
						Delete <Icon.Trash />
					</Menu.Item>
				</Menu.Popup>
			</Menu.Root>
			<RenameDialog
				open={openRenameDialog}
				setOpen={setOpenRenameDialog}
				initialName={name}
				onRename={newName => renameTemplate({ templateId: id, newName })}
			/>
		</div>
	);
});
