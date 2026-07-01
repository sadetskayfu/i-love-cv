import { atom } from 'jotai';
import type { Node, Rect } from '../../types';

export const nodesAtom = atom<Node[]>([]);
export const domNodesAtom = atom<Record<string, HTMLElement>>({});
export const copiedNodesAtom = atom<Node[]>([]);
export const creationRectAtom = atom<Rect | null>(null);
export const isCreationRectAtom = atom<boolean>(false);

