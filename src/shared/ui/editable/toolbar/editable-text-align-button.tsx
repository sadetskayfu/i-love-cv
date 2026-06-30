import * as React from 'react';
import { useSlate } from 'slate-react';
import { Icon } from '@/shared/ui/icons';
import { isActive } from '../helpers/is-active';
import { Transforms } from 'slate';
import { mergeProps, useRender, type ComponentRenderFn, type HTMLProps } from '@base-ui/react';
import { useTranslation } from '@/shared/translation';
import { EDITABLE_BUTTON_LABELS } from '../editable-button-labels';
import type { TextAlignType } from '../editable-types';

export function EditableTextAlignButton({
	ref,
	render,
	format,
	...otherProps
}: EditableTextAlignButton.Props) {
	const editor = useSlate();
	const active = isActive(editor, format, 'text-align');

	const { t } = useTranslation();

	const state: EditableTextAlignButton.State = React.useMemo(
		() => ({
			active,
		}),
		[active]
	);

	const element = useRender({
		defaultTagName: 'button',
		ref,
		render,
		state,
		props: mergeProps<'button'>(
			{
				'aria-pressed': active ? 'true' : 'false',
				'aria-label': t(EDITABLE_BUTTON_LABELS[format]),
				onClick: () => {
					Transforms.setNodes(editor, { align: active ? undefined : format });
				},
				children: (
					<React.Fragment>
						{format === 'left' && <Icon.TextAlignStart />}
						{format === 'center' && <Icon.TextAlignCenter />}
						{format === 'right' && <Icon.TextAlignEnd />}
						{format === 'justify' && <Icon.TextAlignJustify />}
					</React.Fragment>
				),
			},
			otherProps
		),
	});

	return element;
}

export namespace EditableTextAlignButton {
	export type State = {
		active: boolean;
	};
	export type Props = React.ComponentProps<'button'> & {
		format: TextAlignType;
		render?:
			| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
			| ComponentRenderFn<Omit<HTMLProps, 'color'>, State>;
	};
}

