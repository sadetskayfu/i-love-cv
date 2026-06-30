import { MOD_KEY } from '@/shared/constants';
import type { TextMarkType } from './editable-types';

export const EDITABLE_HOTKEYS: Record<TextMarkType, { keyLabel: string; key: string }> = {
	bold: {
		keyLabel: `${MOD_KEY} + B`,
		key: 'mod+b',
	},
	italics: {
		keyLabel: `${MOD_KEY} + I`,
		key: 'mod+i',
	},
	underline: {
		keyLabel: `${MOD_KEY} + U`,
		key: 'mod+u',
	},
	strikethrough: {
		keyLabel: `${MOD_KEY} + F`,
		key: 'mod+f',
	},
};
