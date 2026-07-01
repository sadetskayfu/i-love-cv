import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { CreateTemplateDialog } from './create-template-dialog';

export function CreateTemplateButton() {
	return (
		<CreateTemplateDialog>
			<Button aria-label="Add new template" iconButton>
				<Icon.Plus />
			</Button>
		</CreateTemplateDialog>
	);
}
