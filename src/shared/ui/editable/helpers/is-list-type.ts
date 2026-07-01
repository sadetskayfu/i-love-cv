import { LIST } from '../editable-types';
import type { ElementFormat, ElementType, ListType } from '../editable-types';

export function isListType(format: ElementFormat | ElementType): format is ListType {
	return LIST.includes(format as ListType);
}
