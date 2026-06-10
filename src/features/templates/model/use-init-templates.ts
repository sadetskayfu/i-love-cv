import { useSetAtom } from 'jotai';
import { useIsoLayoutEffect } from '@/shared/hooks/use-iso-layout-effect';
import {
	loadStoredActiveTemplateId,
	loadStoredNodes,
	loadStoredTemplates,
	updateStoredActiveTemplateId,
	updateStoredTemplates,
} from './local-storage';
import { activeTemplateIdAtom, templatesAtom } from './state';
import { DEFAULT_TEMPLATE } from './default-template';
import { boardState } from '@/features/board';

export function useInitTemplates() {
	const setTemplates = useSetAtom(templatesAtom);
	const setActiveTemplateId = useSetAtom(activeTemplateIdAtom);
	const setNodes = useSetAtom(boardState.nodesAtom);
	const setHistory = useSetAtom(boardState.historyAtom);

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
