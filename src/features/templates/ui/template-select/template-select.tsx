import * as React from 'react';
import { useAtom } from 'jotai';
import { templateSelectors } from '../../model';
import { Dialog } from '@/shared/ui/dialog';
import { CreateTemplateDialog } from '../create-template-dialog';
import { Button } from '@/shared/ui/button';
import { ItemList } from './item-list';

export function TemplateSelect() {
	const [open, setOpen] = React.useState<boolean>(false);
	const [activeTemplateName] = useAtom(templateSelectors.activeTemplateName);

	const closeDialog = React.useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={<Button className="w-50" />}>
				<span className="truncate">{activeTemplateName}</span>
			</Dialog.Trigger>
			<Dialog.Popup className="w-130" backdrop>
				<Dialog.Header>
					<h2>Your templates</h2>
				</Dialog.Header>
				<div className="flex flex-col gap-y-2 p-2">
					<ItemList onSelect={closeDialog} />
					<CreateTemplateDialog onCreate={closeDialog}>
						<Button color="secondary">
							Add new template
						</Button>
					</CreateTemplateDialog>
				</div>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
