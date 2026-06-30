import { isAlignElement } from './helpers/is-align-element';
import type { TextAlignType } from './editable-types';
import type { RenderElementProps } from 'slate-react';

export function EditableElement({ attributes, children, element }: RenderElementProps) {
	const style: React.CSSProperties = {};

	if (isAlignElement(element)) {
		style.textAlign = element.align as TextAlignType;
	}

	switch (element.type) {
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			);
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			);
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			);
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			);
	}
}
