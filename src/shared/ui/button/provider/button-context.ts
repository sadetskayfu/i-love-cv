import * as React from 'react';
import type { Button } from '../button';

export type ButtonContext = Pick<
	Button.Props,
	'className' | 'size' | 'radius' | 'variant' | 'color' | 'iconButton' | 'disabled'
>;

export const ButtonContext = React.createContext<ButtonContext | undefined>(undefined);

export function useButtonContext() {
	return React.useContext(ButtonContext);
}
