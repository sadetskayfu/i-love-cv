import * as React from 'react';
import { ButtonContext } from './button-context';

export const ButtonProvider = (props: ButtonProvider.Props) => {
	const { children, className, color, size, radius, variant, disabled, iconButton } = props;

	const contextValue: ButtonContext = React.useMemo(
		() => ({ className, color, size, variant, disabled, iconButton, radius }),
		[className, color, size, variant, disabled, iconButton, radius]
	);

	return <ButtonContext.Provider value={contextValue}>{children}</ButtonContext.Provider>;
};

export namespace ButtonProvider {
	export interface Props extends ButtonContext {
		children?: React.ReactNode;
	}
}
