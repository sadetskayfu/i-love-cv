import { atom } from 'jotai';
import type { Rect } from '../../types';

export const selectedNodeIdsAtom = atom(new Set<string>());
export const candidateNodeIdsAtom = atom(new Set<string>());
export const selectionRectAtom = atom<Rect | null>(null);
export const isSelectionRectAtom = atom<boolean>(false);
