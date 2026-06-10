import * as React from 'react';
import { Button } from '@/shared/ui/button';

export const ToggleButton = React.forwardRef(function ToggleButton(
	props: ToggleButton.Props,
	forwardedRef: React.ForwardedRef<HTMLButtonElement>
) {
	const { pressed, children, ...otherProps } = props;

	return (
		<Button
			ref={forwardedRef}
			color={pressed ? 'accent' : 'secondary'}
			variant={pressed ? 'ghost' : 'clear'}
			aria-pressed={pressed ? 'true' : 'false'}
			{...otherProps}
		>
			{children}
		</Button>
	);
});

export namespace ToggleButton {
	export type Props = Omit<Button.Props, 'color' | 'variant'> & {
		pressed: boolean;
	};
}
