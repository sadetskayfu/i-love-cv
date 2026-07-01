import { atom } from 'jotai';
import type { Mode } from '../types';

export const modeAtom = atom<Mode>('selection');
export const snapToGrid = atom<boolean>(false);
export const snapToObject = atom<boolean>(false);
export const showGrid = atom<boolean>(false);
