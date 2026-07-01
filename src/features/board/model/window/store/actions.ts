import { atom } from 'jotai';
import { DEFAULT_ZOOM } from '../constants';
import { windowPositionAtom, zoomAtom } from './state';

export const resetZoom = atom(null, (_, set) => {
	set(zoomAtom, DEFAULT_ZOOM);
});

export const resetWindowPosition = atom(null, (_, set) => {
	set(windowPositionAtom, { x: 0, y: 0 });
});
