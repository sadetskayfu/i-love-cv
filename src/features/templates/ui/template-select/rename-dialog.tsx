import * as React from 'react';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { MaxLengthIndicator } from '@/shared/ui/max-length-indicator';
import { Button } from '@/shared/ui/button';
import { validateTemplateName, MAX_TEMPLATE_NAME_LENGTH } from '../../validation';

export function RenameDialog({
	open,
	setOpen,
	initialName,
	onRename,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	initialName: string;
	onRename: (newName: string) => void;
}) {
	const [newName, setNewName] = React.useState<string>(initialName);

	const inputRef = React.useRef<HTMLInputElement>(null);

	function handleRename() {
		const templateName = validateTemplateName(newName, true);

		if (typeof templateName === 'string') {
			setOpen(false);

			if (templateName === initialName) {
				return;
			} else {
				onRename(templateName);
			}
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Popup className="w-100" initialFocus={inputRef}>
				<Dialog.Header>
					<h2>Template name changes</h2>
				</Dialog.Header>
				<div className="mt-5 flex flex-col gap-y-5 px-3 pb-3">
					<div className="flex flex-col gap-y-1">
						<Input
							ref={inputRef}
							value={newName}
							onValueChange={value => {
								if (validateTemplateName(value)) {
									setNewName(value);
								}
							}}
							onKeyDown={event => {
								if (event.key === 'Enter') {
									handleRename();
								}
							}}
							placeholder="Input template name.."
						/>
						<MaxLengthIndicator value={newName} maxLength={MAX_TEMPLATE_NAME_LENGTH} />
					</div>
					<div className="ml-auto flex gap-x-2">
						<Button
							onClick={handleRename}
							disabled={newName.length === 0}
							color="accent"
							variant="ghost"
						>
							Change name
						</Button>
					</div>
				</div>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
