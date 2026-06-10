import { v4 } from 'uuid';
import type { Template } from './types';

export const DEFAULT_TEMPLATE: Template = {
	id: v4(),
	name: 'My first CV',
	colors: [
		{ value: '1', hex: '#DCC483' },
		{ value: '2', hex: '#DCC483' },
		{ value: '3', hex: '#DCC483' },
		{ value: '4', hex: '#DCC483' },
		{ value: '5', hex: '#DCC483' },
	],
};