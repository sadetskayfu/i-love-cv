import * as React from 'react';
import { useSetAtom } from 'jotai';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { MaxLengthIndicator } from '@/shared/ui/max-length-indicator';
import { MAX_TEMPLATE_NAME_LENGTH, validateTemplateName } from '../validation';
import { templateStore } from '../model';

export function CreateTemplateDialog({
	children,
	onCreate,
}: {
	children: React.ReactElement;
	onCreate?: () => void;
}) {
	const [open, setOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>('');
	const createTemplate = useSetAtom(templateStore.createTemplate);

	const inputRef = React.useRef<HTMLInputElement>(null);

	function handleCreateTemplate() {
		const templateName = validateTemplateName(name, true);

		if (typeof templateName === 'string') {
			createTemplate(templateName);
			onCreate?.();
			setOpen(false);

			setTimeout(() => {
				setName('');
			}, 200);
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={children} />
			<Dialog.Popup className="w-100" initialFocus={inputRef} backdrop>
				<Dialog.Header>
					<h2>Creating template</h2>
				</Dialog.Header>
				<div className="mt-5 flex flex-col gap-y-5 px-3 pb-3">
					<div className="flex flex-col gap-y-1">
						<Input
							ref={inputRef}
							value={name}
							onValueChange={value => {
								if (validateTemplateName(value)) {
									setName(value);
								}
							}}
							onKeyDown={event => {
								if (event.key === 'Enter') {
									handleCreateTemplate();
								}
							}}
							placeholder="Input template name.."
						/>
						<MaxLengthIndicator value={name} maxLength={MAX_TEMPLATE_NAME_LENGTH} />
					</div>
					<div className="ml-auto flex gap-x-2">
						<Button onClick={handleCreateTemplate} disabled={name.length === 0}>
							Create template
						</Button>
					</div>
				</div>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
