import { Button } from '@/shared/ui/button';
import { CreateTemplateDialog } from './create-template-dialog';
import { Icon } from '@/shared/ui/icons';

export function CreateTemplateButton() {
	return (
		<CreateTemplateDialog>
			<Button aria-label='Add new template' iconButton>
				<Icon.Plus />
			</Button>
		</CreateTemplateDialog>
	);
}
