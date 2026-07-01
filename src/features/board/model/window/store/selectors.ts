import { atom } from 'jotai';
import { MAX_ZOOM, MIN_ZOOM } from '../constants';
import { zoomAtom } from './state';

export const isMinZoom = atom(get => {
	const zoom = get(zoomAtom);

	return zoom === MIN_ZOOM;
});

export const isMaxZoom = atom(get => {
	const zoom = get(zoomAtom);

	return zoom === MAX_ZOOM;
});
