import { atom } from 'jotai';
import { DEFAULT_ZOOM } from '../constants';
import type { Position } from '../../types';

export const windowPositionAtom = atom<Position>({ x: 0, y: 0 });
export const zoomAtom = atom<number>(DEFAULT_ZOOM);
export const isWindowDraggingAtom = atom<boolean>(false);
export const hasWindowDraggingAtom = atom<boolean>(false);
