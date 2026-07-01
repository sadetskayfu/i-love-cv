import { atom } from 'jotai';
import { DEFAULT_TEMPLATE } from '../default-template';
import { activeTemplateIdAtom, templatesAtom } from './state';
import type { Template } from '../types';

export const templatesArrayReverse = atom(get => {
	const templates = get(templatesAtom);

	return [...templates].reverse();
});

export const activeTemplate = atom(get => {
	const templates = get(templatesAtom);
	const activeTemplateId = get(activeTemplateIdAtom);

	if (!activeTemplateId) {
		return DEFAULT_TEMPLATE;
	}

	let findedTemplate: Template | null = null;

	templates.forEach(template => {
		if (template.id === activeTemplateId) {
			findedTemplate = template;
			return;
		}
	});

	return findedTemplate ?? DEFAULT_TEMPLATE;
});

export const activeTemplateName = atom(get => {
	const template = get(activeTemplate);

	return template.name;
});
