import { useAtom } from 'jotai';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { templateStore } from '../../model';
import { Item } from './item';

export function ItemList({ onSelect }: { onSelect: () => void }) {
	const [templates] = useAtom(templateStore.templatesArrayReverse);
	const [activeTemplateId] = useAtom(templateStore.activeTemplateIdAtom);

	return (
		<ScrollArea.Root className="max-h-50 min-h-0 flex flex-col">
			<ScrollArea.Viewport overflowShadow>
				<ScrollArea.Content variablePadding>
					{templates.map(template => (
						<Item
							key={template.id}
							id={template.id}
							name={template.name}
							active={template.id === activeTemplateId}
							disabledDelete={templates.length === 1}
							onSelect={onSelect}
						/>
					))}
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar />
		</ScrollArea.Root>
	);
}
