import { useSetAtom } from 'jotai';
import { historyStore, nodeManagerStore } from '@/features/board';
import { useIsoLayoutEffect } from '@/shared/hooks/use-iso-layout-effect';
import { DEFAULT_TEMPLATE } from './default-template';
import {
	loadStoredActiveTemplateId,
	loadStoredNodes,
	loadStoredTemplates,
	updateStoredActiveTemplateId,
	updateStoredTemplates,
} from './local-storage';
import { templateStore } from './store';

export function useInitTemplates() {
	const setTemplates = useSetAtom(templateStore.templatesAtom);
	const setActiveTemplateId = useSetAtom(templateStore.activeTemplateIdAtom);
	const setNodes = useSetAtom(nodeManagerStore.nodesAtom);
	const setHistory = useSetAtom(historyStore.historyAtom);

	useIsoLayoutEffect(() => {
		const storedTemplates = loadStoredTemplates();
		const storedActiveTemplateId = loadStoredActiveTemplateId();

		let activeTemplateId: string = '';

		if (storedTemplates && storedTemplates.length > 0) {
			if (storedActiveTemplateId) {
				activeTemplateId = storedActiveTemplateId;
			} else {
				activeTemplateId = storedTemplates[storedTemplates.length - 1].id;
				updateStoredActiveTemplateId(activeTemplateId);
			}

			const nodes = loadStoredNodes(activeTemplateId);

			setNodes(nodes ?? []);
			setHistory(nodes ? [nodes] : [[]]);
			setTemplates(storedTemplates);
			setActiveTemplateId(activeTemplateId);
		} else {
			setTemplates([DEFAULT_TEMPLATE]);
			setActiveTemplateId(DEFAULT_TEMPLATE.id);
			updateStoredActiveTemplateId(DEFAULT_TEMPLATE.id);
			updateStoredTemplates([DEFAULT_TEMPLATE]);
			setNodes([]);
			setHistory([[]]);
		}
	}, []);
}
