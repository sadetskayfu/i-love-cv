import * as React from 'react';
import { CreateTemplateButton, TemplateSelect } from '@/features/templates';

export const Header = React.memo(function Header() {
	return (
		<header className="z-10 h-15 py-2">
			<div className="my-container flex gap-x-1">
				<TemplateSelect />
				<CreateTemplateButton />
			</div>
		</header>
	);
});
