import {
	EMPTY_ARRAY as BASE_EMPTY_ARRAY,
	EMPTY_OBJECT as BASE_EMPTY_OBJECT,
	NOOP as BASE_NOOP,
} from '@base-ui/utils/empty';

export const EMPTY_ARRAY = BASE_EMPTY_ARRAY;
export const EMPTY_OBJECT = BASE_EMPTY_OBJECT;
export const NOOP = BASE_NOOP;

export const IS_MAC = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);
export const IS_ANDROID = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
export const MOD_KEY = IS_MAC ? 'Cmd' : 'Ctrl';
