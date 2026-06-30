import { LIST, type ElementFormat, type ElementType, type ListType } from '../editable-types';

export function isListType(format: ElementFormat | ElementType): format is ListType {
	return LIST.includes(format as ListType);
}
