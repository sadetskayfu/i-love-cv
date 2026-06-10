import z from 'zod';
import { LOCAL_STORAGE_KEY, loadFromLocalStorage } from '@/shared/local-storage';
import { TemplatesArraySchema, type TemplatesArray } from './types';
import { NodesArraySchema, type NodesArray } from '@/features/board';

const TEMPLATES_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY}_templates`;
const ACTIVE_TEMPLATE_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY}_active-template`;

function generateNodesLocalStorageKey(templateId: string) {
	return `${LOCAL_STORAGE_KEY}_nodes_${templateId}`;
}

export function loadStoredNodes(templateId: string) {
	return loadFromLocalStorage(generateNodesLocalStorageKey(templateId), {
		clearOnError: true,
		zodSchema: NodesArraySchema,
	});
}
export function updateStoredNodes(templateId: string, nodes: NodesArray) {
	localStorage.setItem(generateNodesLocalStorageKey(templateId), JSON.stringify(nodes))
}
export function deleteStoredNodes(templateId: string) {
	localStorage.removeItem(generateNodesLocalStorageKey(templateId))
}

export function updateStoredTemplates(templates: TemplatesArray) {
	localStorage.setItem(TEMPLATES_LOCAL_STORAGE_KEY, JSON.stringify(templates));
}

export function loadStoredTemplates() {
	return loadFromLocalStorage(TEMPLATES_LOCAL_STORAGE_KEY, {
		clearOnError: true,
		zodSchema: TemplatesArraySchema,
	});
}

export function updateStoredActiveTemplateId(activeTemplateId: string) {
	localStorage.setItem(ACTIVE_TEMPLATE_LOCAL_STORAGE_KEY, JSON.stringify(activeTemplateId));
}

export function loadStoredActiveTemplateId() {
	return loadFromLocalStorage(ACTIVE_TEMPLATE_LOCAL_STORAGE_KEY, {
		clearOnError: true,
		zodSchema: z.string(),
	});
}
