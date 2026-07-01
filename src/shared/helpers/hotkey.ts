import * as React from 'react';

export type HotkeyParams = {
	key?: string;
	code?: string;
	shift?: boolean | undefined;
	meta?: boolean | undefined;
};

export function hotkey(
	event: KeyboardEvent | React.KeyboardEvent,
	fn: Function,
	{ key, code, shift, meta }: HotkeyParams
) {
	const isMeta = event.ctrlKey || event.metaKey;

	if (shift === true && !event.shiftKey) {
		return;
	}
	if (shift === false && event.shiftKey) {
		return;
	}
	if (meta === true && !isMeta) {
		return;
	}
	if (meta === false && isMeta) {
		return;
	}

	if ((key && key === event.key) || (code && code === event.code)) {
		fn();
	}
}
