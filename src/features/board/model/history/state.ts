import { atom } from 'jotai';
import type { Node } from '../types';

export const historyAtom = atom<Node[][]>([]);
export const historyIndexAtom = atom<number>(0);
