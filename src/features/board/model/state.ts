import { atom } from 'jotai';
import type { Mode, Node, WindowPosition, Rect } from './types';

// --- Nodes ---
export const nodesAtom = atom<Node[]>([]);
export const domNodesAtom = atom<Record<string, HTMLElement>>({});
export const copiedNodesAtom = atom<Node[]>([])
export const isNodesDraggingAtom = atom<boolean>(false);

export const creatingRectAtom = atom<Rect | null>(null)
export const selectionRectAtom = atom<Rect | null>(null);
export const isRectAtom = atom<boolean>(false)

// --- Selection ---
export const selectedNodeIdsAtom = atom(new Set<string>());
export const visualSelectedNodeIdsAtom = atom(new Set<string>());
export const nodeIdInEditAtom = atom<string | null>(null)

// --- Window ---
export const windowPositionAtom = atom<WindowPosition>({ x: 0, y: 0, zoom: 1 });
export const isWindowDraggingAtom = atom<boolean>(false);
export const hasWindowDraggingAtom = atom<boolean>(false)

// --- History ---
export const historyAtom = atom<Node[][]>([]);
export const historyIndexAtom = atom<number>(0);

// --- Board ---
export const modeAtom = atom<Mode>('selection');
export const snapToGrid = atom<boolean>(false)
export const snapToObject = atom<boolean>(false)
export const showGrid = atom<boolean>(false)