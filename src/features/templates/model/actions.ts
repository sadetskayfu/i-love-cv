import { atom } from 'jotai';
import { v4 } from 'uuid';
import { activeTemplateIdAtom, templatesAtom } from './state';
import { activeTemplate as getActiveTemplate } from './selectors';
import { deleteStoredNodes, loadStoredNodes, updateStoredActiveTemplateId, updateStoredTemplates } from './local-storage';
import { boardActions, boardState } from '@/features/board';
import type { TemplatesArray } from './types';

const onChangeTemplate = atom(null, (_, set, templateId: string) => {
	const nodes = loadStoredNodes(templateId)

	set(boardActions.resetWindowPosition)
	set(boardActions.clearSelectedNodes)
	set(boardState.historyAtom, nodes ? [nodes] : [[]]);
	set(boardState.historyIndexAtom, 0)
	set(boardState.nodesAtom, nodes ?? [])
	set(activeTemplateIdAtom, templateId);

	updateStoredActiveTemplateId(templateId);
})

export const selectTemplate = atom(null, (get, set, templateId: string) => {
	const activeTemplateId = get(activeTemplateIdAtom);

	if (activeTemplateId && activeTemplateId === templateId) {
		return;
	}

	const templatesArray = get(templatesAtom);
	const template = templatesArray.find(template => template.id === templateId);

	if (!template) {
		return;
	}

	const filteredTempaltesArray = templatesArray.filter(template => template.id !== templateId);
	const newTempaltesArray = [...filteredTempaltesArray, template];

	set(onChangeTemplate, templateId)
	set(templatesAtom, newTempaltesArray);

	updateStoredTemplates(newTempaltesArray);
});

export const createTemplate = atom(null, (get, set, templateName: string) => {
	const templates = get(templatesAtom);
	const activeTemplate = get(getActiveTemplate);

	const newId = v4();
	const newTemplates: TemplatesArray = [
		...templates,
		{ ...activeTemplate, id: newId, name: templateName },
	];

	set(onChangeTemplate, newId)
	set(templatesAtom, newTemplates);

	updateStoredTemplates(newTemplates);
});

export const deleteTemplateAtom = atom(null, (get, set, templateId: string) => {
	const templates = get(templatesAtom);
	const activeTemplateId = get(activeTemplateIdAtom);	

	if (templates.length === 1) {
		return
	}

	const newTemplates = templates.filter((template) => template.id !== templateId)

	if (activeTemplateId === templateId) {
		const lastTemplate = newTemplates[newTemplates.length - 1];

		set(onChangeTemplate, lastTemplate.id)
	}

	set(templatesAtom, newTemplates);
	updateStoredTemplates(newTemplates);
	deleteStoredNodes(templateId)
});

export const renameTemplate = atom(
	null,
	(get, set, { templateId, newName }: { templateId: string; newName: string }) => {
		const templates = get(templatesAtom);

		const newTemplates = templates.map((template) => {
			if (template.id === templateId) {
				return {...template, name: newName}
			}
			return template
		})

		set(templatesAtom, newTemplates);
		updateStoredTemplates(newTemplates);
	}
);
