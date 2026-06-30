import * as React from 'react';
import { useContext } from '@/shared/hooks/use-context';
import type { Editable } from './editable';

export type EditableContext = Pick<Editable.Props, 'backgroundColors' | 'fontColors'>;

export const EditableContext = React.createContext<EditableContext | undefined>(undefined);

export function useEditableContext() {
	return useContext(EditableContext, 'EditableContext is missing');
}
