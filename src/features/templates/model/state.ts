import { atom } from 'jotai';
import type { TemplatesArray } from './types';

export const templatesAtom = atom<TemplatesArray>([]);
export const activeTemplateIdAtom = atom<string | null>(null);
