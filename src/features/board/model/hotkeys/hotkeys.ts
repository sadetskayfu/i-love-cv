import type { HotkeyParams } from '@/shared/helpers';

type Operation =
	| 'add-text-node'
	| 'add-shape-node'
	| 'undo'
	| 'redo'
	| 'copy-nodes'
	| 'paste-nodes'
	| 'delete-nodes';

export const HOTKEYS: Record<Operation, HotkeyParams & { keyLabel: string }> = {
	'add-text-node': {
		keyLabel: 'T',
		code: 'KeyT',
	},
	'add-shape-node': {
		keyLabel: 'F',
		code: 'KeyF',
	},
	undo: {
		keyLabel: 'Ctrl + Z',
		code: 'KeyZ',
		meta: true,
		shift: false,
	},
	redo: {
		keyLabel: 'Ctrl + Shift + Z',
		code: 'KeyZ',
		meta: true,
		shift: true,
	},
	'copy-nodes': {
		keyLabel: 'Ctrl + C',
		code: 'KeyC',
		meta: true,
	},
	'paste-nodes': {
		keyLabel: 'Ctrl + V',
		code: 'KeyV',
		meta: true,
	},
	'delete-nodes': {
		keyLabel: 'Del',
		key: 'Delete',
	},
};
