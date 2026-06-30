import type { Element, ElementWithAlign } from '../editable-types';

export function isAlignElement(element: Element): element is ElementWithAlign {
	return 'align' in element;
}
