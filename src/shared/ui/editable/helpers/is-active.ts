import { Editor, Node } from 'slate';
import { isAlignElement } from './is-align-element';
import type { CustomEditor, ElementFormat, TextMarkType } from '../editable-types';

export function isActive(
	editor: CustomEditor,
	format: ElementFormat | number,
	type: 'block-type' | 'mark' | 'text-align' | 'font-color' | 'background-color'
) {
	if (type === 'mark' || type === 'font-color' || type === 'background-color') {
		const marks = Editor.marks(editor);

		if (type === 'mark') {
			return marks ? marks[format as TextMarkType] === true : false;
		}
		if (type === 'font-color') {
			return marks ? marks['fontColor'] === format : false;
		}
		if (type === 'background-color') {
			return marks ? marks['backgroundColor'] === format : false;
		}
	}

	const { selection } = editor;

	if (!selection) {
		return false;
	}

	const matches = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: node => {
				if (Node.isElement(node)) {
					if (type === 'block-type') {
						return node.type === format;
					}
					if (type === 'text-align' && isAlignElement(node)) {
						return node.align === format;
					}
				}
				return false;
			},
		})
	);

	return matches.length > 0;
}
