import * as React from 'react';
import { mergeProps, useRender } from '@base-ui/react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { useTranslation } from '@/shared/translation';
import { isActive } from '../helpers/is-active';
import type { ComponentRenderFn, HTMLProps } from '@base-ui/react';

export function EditableColorButton({
	ref,
	render,
	format,
	colorValue,
	colorHex,
	...otherProps
}: EditableColorButton.Props) {
	const editor = useSlate();
	const active = isActive(
		editor,
		colorValue,
		format === 'font' ? 'font-color' : 'background-color'
	);

	const { t } = useTranslation();

	const state: EditableColorButton.State = React.useMemo(
		() => ({
			active,
			color: colorHex,
		}),
		[active, colorHex]
	);

	const element = useRender({
		defaultTagName: 'button',
		ref,
		render,
		state,
		props: mergeProps<'button'>(
			{
				'aria-pressed': active ? 'true' : 'false',
				'aria-label': `${t('Color')} ${colorValue} ${colorHex}`,
				onClick: () => {
					Editor.addMark(editor, format === 'font' ? 'fontColor' : 'backgroundColor', colorValue);
				},
			},
			otherProps
		),
	});

	return element;
}

export namespace EditableColorButton {
	export type State = {
		active: boolean;
		color: string | undefined;
	};
	export type Props = React.ComponentProps<'button'> & {
		colorValue: number;
		colorHex: string | undefined;
		format: 'font' | 'backgroud';
		render?:
			| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
			| ComponentRenderFn<Omit<HTMLProps, 'color'>, State>;
	};
}
