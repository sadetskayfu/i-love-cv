import { useEditableContext } from './editable-context';
import type { RenderLeafProps } from 'slate-react';

export function EditableLeaf({ attributes, children, leaf }: RenderLeafProps) {
	const { fontColors, backgroundColors } = useEditableContext();

	const color = fontColors[leaf.fontColor - 1];
	const backgroundColor = backgroundColors[leaf.backgroundColor - 1];

	const style: React.CSSProperties = {
		color,
		backgroundColor,
	};

	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.italics) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u style={{ textDecorationColor: color }}>{children}</u>;
	}

	if (leaf.strikethrough) {
		children = <del style={{ textDecorationColor: color }}>{children}</del>;
	}

	return (
		<span style={style} {...attributes}>
			{children}
		</span>
	);
}
