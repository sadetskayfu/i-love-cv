import * as React from 'react';
import { useSlate } from 'slate-react';
import { Icon } from '@/shared/ui/icons';
import { isActive } from '../helpers/is-active';
import { Node, Transforms } from 'slate';
import { isListType } from '../helpers/is-list-type';
import { mergeProps, useRender, type ComponentRenderFn, type HTMLProps } from '@base-ui/react';
import { useTranslation } from '@/shared/translation';
import { EDITABLE_BUTTON_LABELS } from '../editable-button-labels';
import type { ElementType } from '../editable-types';

export function EditableBlockTypeButton({
	ref,
	render,
	format,
	...otherProps
}: EditableBlockTypeButton.Props) {
	const editor = useSlate();
	const active = isActive(editor, format, 'block-type');
	const isList = isListType(format);

	const { t } = useTranslation();

	const state: EditableBlockTypeButton.State = React.useMemo(
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
					Transforms.unwrapNodes(editor, {
						match: node => Node.isElement(node) && isListType(node.type),
						split: true,
					});

					Transforms.setNodes(editor, {
						type: active ? 'paragraph' : isList ? 'list-item' : format,
					});

					if (!active && isList) {
						const block = { type: format, fontColor: 1, children: [] };
						Transforms.wrapNodes(editor, block);
					}
				},
				children: (
					<React.Fragment>
						{format === 'numbered-list' && <Icon.ListOrdered />}
						{format === 'bulleted-list' && <Icon.List />}
					</React.Fragment>
				),
			},
			otherProps
		),
	});

	return element;
}

export namespace EditableBlockTypeButton {
	export type State = {
		active: boolean;
	};
	export type Props = React.ComponentProps<'button'> & {
		format: Exclude<ElementType, 'list-item' | 'paragraph' | 'link'>;
		render?:
			| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
			| ComponentRenderFn<Omit<HTMLProps, 'color'>, State>;
	};
}
