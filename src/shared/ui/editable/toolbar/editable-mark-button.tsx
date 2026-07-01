import * as React from 'react';
import { mergeProps, useRender } from '@base-ui/react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { useTranslation } from '@/shared/translation';
import { Icon } from '@/shared/ui/icons';
import { EDITABLE_BUTTON_LABELS } from '../editable-button-labels';
import { EDITABLE_HOTKEYS } from '../editable-hotkeys';
import { isActive } from '../helpers/is-active';
import type { TextMarkType } from '../editable-types';
import type { ComponentRenderFn, HTMLProps } from '@base-ui/react';

export function EditableMarkButton({
	ref,
	render,
	format,
	...otherProps
}: EditableMarkButton.Props) {
	const editor = useSlate();
	const active = isActive(editor, format, 'mark');

	const { t } = useTranslation();

	const state: EditableMarkButton.State = React.useMemo(
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
				'aria-keyshortcuts': EDITABLE_HOTKEYS[format].keyLabel.toLocaleLowerCase(),
				onClick: () => {
					if (active) {
						Editor.removeMark(editor, format);
					} else {
						Editor.addMark(editor, format, true);
					}
				},
				children: (
					<React.Fragment>
						{format === 'bold' && <Icon.Bold />}
						{format === 'italics' && <Icon.Italic />}
						{format === 'underline' && <Icon.Underline />}
						{format === 'strikethrough' && <Icon.Strikethrough />}
					</React.Fragment>
				),
			},
			otherProps
		),
	});

	return element;
}

export namespace EditableMarkButton {
	export type State = {
		active: boolean;
	};
	export type Props = React.ComponentProps<'button'> & {
		format: TextMarkType;
		render?:
			| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
			| ComponentRenderFn<Omit<HTMLProps, 'color'>, State>;
	};
}
